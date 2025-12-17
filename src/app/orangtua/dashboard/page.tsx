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

import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

import {
  getOrtuDashboardStats,
  getOrtuDashboardChart,
  getOrtuUpcomingSchedules,
} from "@/lib/api/dashboardOrtu";

export default function DashboardOrtuPage() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<any>({
    total_children: { count: 0, percentage: 0, direction: "up", label: "" },
    total_observations: { count: 0, percentage: 0, direction: "up", label: "" },
    total_assessments: { count: 0, percentage: 0, direction: "up", label: "" },
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  const [activeTab, setActiveTab] =
    useState<"Semua" | "Observasi" | "Assessment">("Semua");

  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        // ===================== STATS =====================
        const ST = (await getOrtuDashboardStats())?.data ?? {};

        setStats({
          total_children: ST.total_children,
          total_observations: ST.total_observations,
          total_assessments: ST.total_assessments,
        });

        // ===================== CHART =====================
        const CH = (await getOrtuDashboardChart())?.data ?? [];

        const monthFormatter = (monthString: string) => {
          try {
            const dt = new Date(monthString + "-01");
            return dt.toLocaleString("id-ID", { month: "short" });
          } catch {
            return monthString;
          }
        };

        const mapped = Array.isArray(CH)
          ? CH.map((x: any) => ({
              name: monthFormatter(x.month),
              total_children: x.total_children,
              total_observations: x.total_observations,
              total_assessments: x.total_assessments,
            }))
          : [];

        setChartData(mapped);

        // ===================== SCHEDULE (IMPORTANT FIX) =====================
        const SC = (await getOrtuUpcomingSchedules("all"))?.data ?? [];

        // 🔥 FIX: gunakan service_type sebagai jenis layanan
        const fixed = Array.isArray(SC)
          ? SC.map((r: any) => ({
              id: r.id ?? Math.random(),
              jenis: r.service_type ?? "-", // <-- FIX UTAMA
              nama_pasien: r.child_name ?? "-",

              // BE data untuk Assessment
              asesor: r.therapist ?? "-", // bisa diganti jika BE beda

              // BE tidak punya tipe assessment → isi "-"
              tipe_assessment:
                r.service_type === "Assessment" ? "Assessment" : "-",

              // BE data untuk Observasi
              observer: r.therapist ?? "-",

              status: r.status ?? "-",
              tanggal: r.date ?? null,
              waktu: r.time ?? "-",
            }))
          : [];

        setSchedule(fixed);
      } catch (err) {
        console.error("❌ Error load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ===================== FILTER =====================
  const filteredSchedule = useMemo(() => {
    const qLower = q.toLowerCase();

    return schedule
      .filter((s) => {
        if (activeTab === "Observasi")
          return s.jenis.toLowerCase() === "observation";
        if (activeTab === "Assessment")
          return s.jenis.toLowerCase() === "assessment";
        return true;
      })
      .filter((s) => s.nama_pasien.toLowerCase().includes(qLower));
  }, [schedule, q, activeTab]);

  function formatDate(d: string | null) {
    if (!d) return "-";
    return d; // BE format sudah DD/MM/YYYY → langsung tampilkan
  }

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );

  // ===================== TABEL =====================

  const renderTableHeader = () => {
    if (activeTab === "Observasi") {
      return (
        <tr>
          <th className="py-3 px-4">Nama Pasien</th>
          <th className="py-3 px-4">Observer</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Tanggal Observasi</th>
          <th className="py-3 px-4">Waktu</th>
        </tr>
      );
    }

    if (activeTab === "Assessment") {
      return (
        <tr>
          <th className="py-3 px-4">Nama Pasien</th>
          <th className="py-3 px-4">Tipe Assessment</th>
          <th className="py-3 px-4">Asesor</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Tanggal Assessment</th>
          <th className="py-3 px-4">Waktu</th>
        </tr>
      );
    }

    return (
      <tr>
        <th className="py-3 px-4">Nama Pasien</th>
        <th className="py-3 px-4">Jenis Layanan</th>
        <th className="py-3 px-4">Status</th>
        <th className="py-3 px-4">Tanggal</th>
        <th className="py-3 px-4">Waktu</th>
      </tr>
    );
  };

  const renderTableRow = (r: any) => {
    if (activeTab === "Observasi") {
      return (
        <tr key={r.id} className="text-sm border-b">
          <td className="py-3 px-4">{r.nama_pasien}</td>
          <td className="py-3 px-4">{r.observer}</td>
          <td className="py-3 px-4">{r.status}</td>
          <td className="py-3 px-4">{formatDate(r.tanggal)}</td>
          <td className="py-3 px-4">{r.waktu}</td>
        </tr>
      );
    }

    if (activeTab === "Assessment") {
      return (
        <tr key={r.id} className="text-sm border-b">
          <td className="py-3 px-4">{r.nama_pasien}</td>
          <td className="py-3 px-4">{r.tipe_assessment}</td>
          <td className="py-3 px-4">{r.asesor}</td>
          <td className="py-3 px-4">{r.status}</td>
          <td className="py-3 px-4">{formatDate(r.tanggal)}</td>
          <td className="py-3 px-4">{r.waktu}</td>
        </tr>
      );
    }

    return (
      <tr key={r.id} className="text-sm border-b">
        <td className="py-3 px-4">{r.nama_pasien}</td>
        <td className="py-3 px-4">{r.jenis}</td>
        <td className="py-3 px-4">{r.status}</td>
        <td className="py-3 px-4">{formatDate(r.tanggal)}</td>
        <td className="py-3 px-4">{r.waktu}</td>
      </tr>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#36315B]">
      <div className="fixed left-0 top-0 h-full w-[250px] bg-white shadow-md z-20">
        <SidebarOrangtua />
      </div>

      <div className="flex-1 flex flex-col ml-[250px]">
        <HeaderOrangtua />

        <main className="p-8 space-y-10">
          <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

          {/* METRICS */}
          <div className="grid grid-cols-3 gap-6">
            <MetricCard title="Total Anak/Pasien" data={stats.total_children} icon="👶" />
            <MetricCard title="Total Observasi" data={stats.total_observations} icon="👁️" />
            <MetricCard title="Total Assessment" data={stats.total_assessments} icon="🧠" />
          </div>

          {/* AREA CHART */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Grafik Aktivitas</h3>

            <div className="h-[300px]">
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorChild" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c73f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7c73f6" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="colorObs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="colorAssess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                  <XAxis dataKey="name" />
                  <YAxis ticks={[0, 20, 40, 60, 80, 100]} />
                  <ReTooltip />

                  <Area
                    type="monotone"
                    dataKey="total_children"
                    name="Total Anak"
                    stroke="#7c73f6"
                    strokeWidth={3}
                    fill="url(#colorChild)"
                  />

                  <Area
                    type="monotone"
                    dataKey="total_observations"
                    name="Total Observasi"
                    stroke="#34d399"
                    strokeWidth={3}
                    fill="url(#colorObs)"
                  />

                  <Area
                    type="monotone"
                    dataKey="total_assessments"
                    name="Total Assessment"
                    stroke="#fb923c"
                    strokeWidth={3}
                    fill="url(#colorAssess)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 text-center text-xs text-gray-700 font-medium">
              <div>Total Anak</div>
              <div>Total Observasi</div>
              <div>Total Assessment</div>
            </div>
          </div>

          {/* JADWAL */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Jadwal Mendatang</h3>

              <div className="flex items-center gap-6">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari Pasien"
                  className="border px-4 py-2 rounded-full text-sm"
                />

                <div className="flex items-center gap-4 text-sm">
                  {(["Semua", "Observasi", "Assessment"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-3 py-2 ${
                        activeTab === t
                          ? "border-b-2 border-emerald-400 text-emerald-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs border-b text-gray-500">
                  {renderTableHeader()}
                </thead>

                <tbody>
                  {filteredSchedule.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-400">
                        Tidak ada jadwal
                      </td>
                    </tr>
                  ) : (
                    filteredSchedule.map((r) => renderTableRow(r))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===========================================================
   METRIC CARD
=========================================================== */
function MetricCard({ title, data, icon }: any) {
  const directionIcon = data.direction === "up" ? "▲" : "▼";
  const directionColor =
    data.direction === "up" ? "text-emerald-600" : "text-red-500";

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between border">
      <div>
        <div className="text-xs text-gray-600">{title}</div>
        <div className="text-2xl font-bold mt-1">{data.count}</div>

        <div className={`flex items-center gap-1 ${directionColor} text-xs mt-1`}>
          <span>{directionIcon}</span>
          <span>{data.label}</span>
        </div>
      </div>

      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  );
}
