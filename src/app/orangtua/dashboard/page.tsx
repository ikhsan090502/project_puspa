"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { Menu, X, Search } from "lucide-react";

import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

import {
  getOrtuDashboardStats,
  getOrtuDashboardChart,
  getOrtuUpcomingSchedules,
} from "@/lib/api/dashboardOrtu";

/* ================= TYPES ================= */
type ChartItem = {
  monthIndex: number;
  name: string;
  total_children: number;
  total_observations: number;
  total_assessments: number;
};

type ScheduleItem = {
  id: number | string;
  jenis: "observation" | "assessment";
  service_type?: string;
  nama_pasien: string;
  observer?: string;
  assessor?: string;
  status: string;
  tanggal: string;
  waktu: string;
};

type StatItem = {
  count: number;
  percentage?: number;
  direction?: "up" | "down";
  label?: string;
};

/* ================= BULAN ================= */
const MONTH_ORDER: Record<string, { index: number; label: string }> = {
  Jan: { index: 0, label: "Jan" },
  Feb: { index: 1, label: "Feb" },
  Mar: { index: 2, label: "Mar" },
  Apr: { index: 3, label: "Apr" },
  Mei: { index: 4, label: "Mei" },
  Jun: { index: 5, label: "Jun" },
  Jul: { index: 6, label: "Jul" },
  Agt: { index: 7, label: "Agt" },
  Sep: { index: 8, label: "Sep" },
  Okt: { index: 9, label: "Okt" },
  Nov: { index: 10, label: "Nov" },
  Des: { index: 11, label: "Des" },
};

const formatDateID = (d?: string) => d || "-";

/* ================= PAGE ================= */
export default function DashboardOrtuPage() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState<{
    total_children: StatItem;
    total_observations: StatItem;
    total_assessments: StatItem;
  }>({
    total_children: { count: 0 },
    total_observations: { count: 0 },
    total_assessments: { count: 0 },
  });

  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] =
    useState<"Semua" | "Observasi" | "Assessment">("Semua");
  const [q, setQ] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function load() {
      try {
        /* ===== STATS ===== */
        const ST = (await getOrtuDashboardStats())?.data ?? {};
        setStats({
          total_children: ST.total_children ?? { count: 0 },
          total_observations: ST.total_observations ?? { count: 0 },
          total_assessments: ST.total_assessments ?? { count: 0 },
        });

        /* ===== CHART ===== */
      const CH = (await getOrtuDashboardChart())?.data ?? [];

const mappedChart: ChartItem[] = CH
  .map((x: any): ChartItem => {
    const [bulan] = String(x.month ?? "").split(" ");
    const m = MONTH_ORDER[bulan];

    return {
      monthIndex: m?.index ?? 0,
      name: m?.label ?? "-",
      total_children: Number(x.total_children ?? 0),
      total_observations: Number(x.total_observations ?? 0),
      total_assessments: Number(x.total_assessments ?? 0),
    };
  })
  .sort((a: ChartItem, b: ChartItem) => a.monthIndex - b.monthIndex);

setChartData(mappedChart);


        /* ===== SCHEDULE ===== */
        const SC = (await getOrtuUpcomingSchedules("all"))?.data ?? [];

        const mappedSchedule: ScheduleItem[] = SC.map((r: any) => {
          const isAssessment =
            String(r.service_type)
              .toLowerCase()
              .includes("assessment");

          return {
            id: r.id,
            jenis: isAssessment ? "assessment" : "observation",
            service_type: r.service_type,
            nama_pasien: r.child_name ?? "-",
            observer: !isAssessment ? r.therapist ?? "-" : "-",
            assessor: isAssessment ? r.therapist ?? "-" : "-",
            status: r.status ?? "-",
            tanggal: r.date ?? "-",
            waktu: r.time ?? "-",
          };
        });

        setSchedule(mappedSchedule);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ================= FILTER ================= */
  const filteredSchedule = useMemo(() => {
    return schedule
      .filter((s) => {
        if (activeTab === "Observasi") return s.jenis === "observation";
        if (activeTab === "Assessment") return s.jenis === "assessment";
        return true;
      })
      .filter((s) =>
        s.nama_pasien.toLowerCase().includes(q.toLowerCase())
      );
  }, [schedule, q, activeTab]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] text-[#36315B]">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow
        transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <SidebarOrangtua />
      </aside>

      {/* TOGGLE */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white shadow rounded"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* CONTENT */}
      <div className="ml-0 md:ml-64 h-screen flex flex-col">
        <header className="fixed top-0 left-0 md:left-64 right-0 h-16 z-30 bg-white shadow">
          <HeaderOrangtua />
        </header>

        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 space-y-8">
          {/* ================= METRIC ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard title="Total Anak/Pasien" data={stats.total_children} icon="👶" />
            <MetricCard title="Total Observasi" data={stats.total_observations} icon="👁️" />
            <MetricCard title="Total Assessment" data={stats.total_assessments} icon="🧠" />
          </div>

          {/* ================= CHART ================= */}
           <div className="bg-white rounded-xl p-5 shadow">
  <h3 className="font-semibold mb-3">Grafik Aktivitas</h3>

  <div className="h-[260px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.08} />

        <XAxis dataKey="name" />

        <YAxis
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          allowDecimals={false}
        />

        <ReTooltip />

        <Area
          dataKey="total_children"
          stroke="#7c73f6"
          fillOpacity={0.15}
        />
        <Area
          dataKey="total_observations"
          stroke="#34d399"
          fillOpacity={0.15}
        />
        <Area
          dataKey="total_assessments"
          stroke="#fb923c"
          fillOpacity={0.15}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>


          {/* ================= TABLE ================= */}
          <div className="bg-white rounded-xl p-6 shadow">
            {/* HEADER */}
            <div className="flex justify-between mb-6">
              <h3 className="font-semibold">Jadwal Mendatang</h3>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari Pasien"
                    className="pl-9 pr-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                {["Semua", "Observasi", "Assessment"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={`px-4 py-1.5 rounded-full text-sm border
                    ${activeTab === t
                        ? "bg-[#81B7A9] text-white"
                        : "bg-white text-gray-500"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <table className="w-full text-sm">
             <thead className="border-b text-gray-500 text-center">
  {activeTab === "Semua" && (
    <tr>
      <th className="py-3">Nama Pasien</th>
      <th>Jenis Layanan</th>
      <th>Status</th>
      <th>Tanggal</th>
      <th>Waktu</th>
    </tr>
  )}
  {activeTab === "Observasi" && (
    <tr>
      <th className="py-3">Nama Pasien</th>
      <th>Observer</th>
      <th>Status</th>
      <th>Tanggal Observasi</th>
      <th>Waktu</th>
    </tr>
  )}
  {activeTab === "Assessment" && (
    <tr>
      <th className="py-3">Nama Pasien</th>
      <th>Jenis Assessment</th>
      <th>Asesor</th>
      <th>Tanggal Assessment</th>
      <th>Waktu</th>
    </tr>
  )}
</thead>


              <tbody className="text-center">
  {filteredSchedule.length === 0 ? (
    <tr>
      <td colSpan={5} className="py-6 text-center text-gray-400">
        Tidak ada jadwal
      </td>
    </tr>
  ) : (
    filteredSchedule.map((r) => (
      <tr key={r.id} className="border-b">
        {activeTab === "Semua" && (
          <>
            <td className="py-3">{r.nama_pasien}</td>
            <td>{r.service_type || "-"}</td>
            <td>{r.status}</td>
            <td>{formatDateID(r.tanggal)}</td>
            <td>{r.waktu}</td>
          </>
        )}
        {activeTab === "Observasi" && (
          <>
            <td className="py-3">{r.nama_pasien}</td>
            <td>{r.observer}</td>
            <td>{r.status}</td>
            <td>{formatDateID(r.tanggal)}</td>
            <td>{r.waktu}</td>
          </>
        )}
        {activeTab === "Assessment" && (
          <>
            <td className="py-3">{r.nama_pasien}</td>
            <td>{r.service_type || "-"}</td>
            <td>{r.assessor}</td>
            <td>{formatDateID(r.tanggal)}</td>
            <td>{r.waktu}</td>
          </>
        )}
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= METRIC CARD ================= */
function MetricCard({
  title,
  data,
  icon,
}: {
  title: string;
  data: StatItem;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow flex justify-between items-center">
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{data.count}</div>
        {data.label && (
          <div
            className={`text-xs mt-1 ${
              data.direction === "down"
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {data.label}
          </div>
        )}
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  );
}
