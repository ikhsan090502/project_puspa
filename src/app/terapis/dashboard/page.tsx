"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import PasienChart from "@/components/dashboard/pasien_chart";

import {
  getDashboardMetrics,
  getUpcomingObservations,
} from "@/lib/api/dashboardTerapis";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashboardRes = await getDashboardMetrics();
        const upcomingRes = await getUpcomingObservations();

        const d = dashboardRes.data;

        console.log("🔵 TREND API RESULT:", d.trend_chart);

        setMetrics(d.metrics);

        setCategories(
          d.patient_categories.map((c: any) => ({
            name: c.category ?? "-",
            value: Number(c.percentage ?? 0),
          }))
        );

        setTrend(
          d.trend_chart.map((t: any) => ({
            name: t.label,
            value: Number(t.value ?? 0),
          }))
        );

        setSchedule(upcomingRes.data.data);

        // periode bulan
        const now = new Date();
        const month = now.toLocaleString("id-ID", { month: "long" });
        const year = now.getFullYear();
        setCurrentPeriod(`${month} ${year}`);
      } catch (e) {
        console.error("Dashboard Error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-6 sm:p-10 overflow-y-auto space-y-10">
          {/* ===================== METRIC CARDS ======================= */}
          <div className="grid grid-cols-4 gap-10">
            {metrics && (
              <>
                <MetricCard
                  label="Total Observasi"
                  current={metrics.total_observations.current}
                  change={`${metrics.total_observations.change_percent}% dari bulan lalu`}
                />
                <MetricCard
                  label="Total Terapis"
                  current={metrics.total_therapists.current}
                  change={`${metrics.total_therapists.change_percent}% dari bulan lalu`}
                />
                <MetricCard
                  label="Tingkat Penyelesaian"
                  current={`${metrics.completion_rate.current}%`}
                  change={`${metrics.completion_rate.change_percent}% dari bulan lalu`}
                />
                <MetricCard
                  label="Total Assessor"
                  current={metrics.total_assessors.current}
                  change={`${metrics.total_assessors.change_percent}% dari bulan lalu`}
                />
              </>
            )}
          </div>

          {/* ===================== CHART ROW ======================= */}
          <div className="grid grid-cols-3 gap-10">
            {/* PIE CHART */}
            <div className="col-span-1">
              <PasienChart apiData={categories} />
            </div>

            {/* TREND AREA CHART */}
            <div className="col-span-2 bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-700">
                  Trend Bulanan
                </h3>
                <div className="text-sm text-gray-400">{currentPeriod}</div>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer>
                  <AreaChart
                    data={trend}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C7B2FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#C7B2FF" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" />

                    {/* === FIX: buat skala 0 → 100 === */}
                    <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />

                    <ReTooltip />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ r: 5, strokeWidth: 2, stroke: "#8B5CF6", fill: "white" }}
                      fill="url(#colorCurve)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ===================== UPCOMING SCHEDULE ======================= */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-700 mb-6">
              Jadwal Mendatang
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3 px-4">Nama Pasien</th>
                    <th className="py-3 px-4">Jenis Layanan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Waktu</th>
                  </tr>
                </thead>

                <tbody>
                  {schedule.map((r: any, i: number) => (
                    <tr key={i} className="text-sm text-slate-700">
                      <td className="py-3 px-4 border-b">{r.nama_pasien}</td>
                      <td className="py-3 px-4 border-b">{r.jenis_layanan}</td>
                      <td className="py-3 px-4 border-b">{r.status}</td>
                      <td className="py-3 px-4 border-b">
                        {new Date(r.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4 border-b">{r.waktu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ======================================================================
   METRIC CARD COMPONENT
====================================================================== */
function MetricCard({ label, current, change }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between">
      <div className="text-xs text-gray-400">{label}</div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-800">{current}</div>
          <div className="text-xs text-emerald-500 mt-1">{change}</div>
        </div>

        <div className="text-3xl text-gray-200 opacity-60">●</div>
      </div>
    </div>
  );
}
