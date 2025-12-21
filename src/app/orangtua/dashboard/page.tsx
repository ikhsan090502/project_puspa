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
import { Menu, X } from "lucide-react";

import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

import {
  getOrtuDashboardStats,
  getOrtuDashboardChart,
  getOrtuUpcomingSchedules,
} from "@/lib/api/dashboardOrtu";

export default function DashboardOrtuPage() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const ST = (await getOrtuDashboardStats())?.data ?? {};
        setStats({
          total_children: ST.total_children,
          total_observations: ST.total_observations,
          total_assessments: ST.total_assessments,
        });

        const CH = (await getOrtuDashboardChart())?.data ?? [];
        setChartData(
          CH.map((x: any) => ({
            name: new Date(x.month + "-01").toLocaleString("id-ID", {
              month: "short",
            }),
            total_children: x.total_children,
            total_observations: x.total_observations,
            total_assessments: x.total_assessments,
          }))
        );

        const SC = (await getOrtuUpcomingSchedules("all"))?.data ?? [];
        setSchedule(
          SC.map((r: any) => {
            const jenis = (r.service_type ?? "")
              .toLowerCase()
              .includes("assessment")
              ? "assessment"
              : "observation";

            return {
              id: r.id,
              jenis,
              jenis_label:
                jenis === "assessment" ? "Assessment" : "Observasi",
              service_type: r.service_type ?? "-",
              nama_pasien: r.child_name ?? "-",
              observer: r.therapist ?? "-",
              asesor: r.therapist ?? "-",
              tipe_assessment:
                jenis === "assessment" ? r.service_type ?? "-" : "-",
              status: r.status ?? "-",
              tanggal: r.date ?? "-",
              waktu: r.time ?? "-",
            };
          })
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ===================== FILTER ===================== */
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

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#36315B]">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static z-20 inset-y-0 left-0 w-64 bg-white shadow-md
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarOrangtua />
      </aside>

      {/* overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 md:hidden p-2 rounded-md bg-white shadow"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <HeaderOrangtua />

        <div className="p-4 md:p-8 space-y-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>

          {/* METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard title="Total Anak/Pasien" data={stats.total_children} icon="👶" />
            <MetricCard title="Total Observasi" data={stats.total_observations} icon="👁️" />
            <MetricCard title="Total Assessment" data={stats.total_assessments} icon="🧠" />
          </div>

          {/* CHART */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Grafik Aktivitas</h3>
            <div className="h-[280px]">
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip />
                  <Area type="monotone" dataKey="total_children" stroke="#7c73f6" />
                  <Area type="monotone" dataKey="total_observations" stroke="#34d399" />
                  <Area type="monotone" dataKey="total_assessments" stroke="#fb923c" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-4">
              <h3 className="text-xl font-semibold">Jadwal Mendatang</h3>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari Pasien"
                  className="border px-4 py-2 rounded-full text-sm"
                />

                <div className="flex gap-3 text-sm">
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
              <table className="w-full text-left text-sm">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="py-2 px-3">Nama Pasien</th>
                    <th className="py-2 px-3">Jenis</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Tanggal</th>
                    <th className="py-2 px-3">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-400">
                        Tidak ada jadwal
                      </td>
                    </tr>
                  ) : (
                    filteredSchedule.map((r) => (
                      <tr key={r.id} className="border-b">
                        <td className="py-2 px-3">{r.nama_pasien}</td>
                        <td className="py-2 px-3">{r.jenis_label}</td>
                        <td className="py-2 px-3">{r.status}</td>
                        <td className="py-2 px-3">{r.tanggal}</td>
                        <td className="py-2 px-3">{r.waktu}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= METRIC CARD ================= */
function MetricCard({ title, data, icon }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center border">
      <div>
        <div className="text-xs text-gray-600">{title}</div>
        <div className="text-2xl font-bold">{data.count}</div>
      </div>
      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  );
}
