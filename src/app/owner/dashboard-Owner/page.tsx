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
  Legend,
} from "recharts";

import SidebarTerapis from "@/components/layout/sidebar_owner";
import HeaderTerapis from "@/components/layout/header_owner";
import PasienChart from "@/components/dashboard/pasien_chart";

import { getOwnerDashboard } from "@/lib/api/dashboardOwner";

export default function DashboardOwnerPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  const years = ["2024", "2025", "2026"];

  // ============================================================
  // Load Dashboard Owner
  // ============================================================
  async function loadDashboard(month: number, year: number) {
    try {
      setLoading(true);

      const res = await getOwnerDashboard(month, year);
      const d = res.data;

      setMetrics(d.metrics ?? null);

      // ---- categories ----
      setCategories(
        Array.isArray(d.patient_categories)
          ? d.patient_categories.map((c: any) => ({
              name: c.type ?? "-",
              value: Number(c.percentage ?? 0),
            }))
          : []
      );

      // ---- trend bulanan ----
      if (Array.isArray(d.historical_trend)) {
        // ambil semua periode dari stage pertama
        const periods = d.historical_trend[0]?.data.map((p: any) => p.period) ?? [];

        // build data per periode
        const trendData: any[] = periods.map((period: string, index: number) => {
          const obj: any = { period };
          d.historical_trend.forEach((stage: any) => {
            const valueRaw = stage.data[index]?.value ?? 0;
            obj[stage.stage] = Number(valueRaw);
          });
          return obj;
        });

        setTrend(trendData);
      } else {
        setTrend([]);
      }

    } catch (err) {
      console.error("Error loading owner dashboard:", err);
      setTrend([]);
      setCategories([]);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(Number(selectedMonth), Number(selectedYear));
  }, [selectedMonth, selectedYear]);

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

          {/* ===================== FILTER PERIODE ======================= */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm w-fit">
            <span className="text-sm font-medium">Pilih Periode:</span>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {years.map((y, i) => (
                <option key={i}>{y}</option>
              ))}
            </select>
          </div>

          {/* ===================== METRIC CARDS ======================= */}
          <div className="grid grid-cols-4 gap-6">
            {metrics && (
              <>
                <MetricCard
                  label="Total Observasi"
                  current={metrics.total_observations?.current ?? 0}
                  change={metrics.total_observations?.formatted_change ?? "0%"}
                />

                <MetricCard
                  label="Total Assessment"
                  current={metrics.total_assessments?.current ?? 0}
                  change={metrics.total_assessments?.formatted_change ?? "0%"}
                />

                <MetricCard
                  label="Tingkat Penyelesaian"
                  current={`${metrics.completion_rate?.current ?? 0}%`}
                  change={metrics.completion_rate?.formatted_change ?? "0%"}
                />

                <MetricCard
                  label="Pertanyaan Yang Belum Terjawab"
                  current={`${metrics.unanswered_questions?.current ?? 0}%`}
                  change={metrics.unanswered_questions?.formatted_change ?? "0%"}
                />
              </>
            )}
          </div>

          {/* ===================== CHART ROW ======================= */}
          <div className="grid grid-cols-3 gap-10">
            
            {/* AREA CHART */}
            <div className="col-span-2 bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-700">
                  Trend Bulanan
                </h3>
                <div className="text-sm text-gray-500">
                  {months[Number(selectedMonth) - 1]} {selectedYear}
                </div>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer>
                  <AreaChart
                    data={trend}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorObservasi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C7B2FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#C7B2FF" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorAssessment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorPenyelesaian" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#34D399" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorAsesor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F87171" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />

                    <Area type="monotone" dataKey="Observasi" stroke="#8B5CF6" fill="url(#colorObservasi)" />
                    <Area type="monotone" dataKey="Assessment" stroke="#F59E0B" fill="url(#colorAssessment)" />
                    <Area type="monotone" dataKey="Penyelesaian" stroke="#10B981" fill="url(#colorPenyelesaian)" />
                    <Area type="monotone" dataKey="Asesor" stroke="#EF4444" fill="url(#colorAsesor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PIE CHART */}
            <div className="col-span-1">
              <PasienChart apiData={categories} />
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
      <div className="text-xs text-gray-500">{label}</div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-800">{current}</div>
          <div className="text-xs text-emerald-500 mt-1">{change}</div>
        </div>

        <div className="text-3xl text-gray-200 opacity-50">●</div>
      </div>
    </div>
  );
}
