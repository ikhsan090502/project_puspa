"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { FileText, Download, Calendar, TrendingUp, Users, Activity } from "lucide-react";

interface ReportData {
  totalPatients: number;
  totalTherapists: number;
  totalObservations: number;
  completedAssessments: number;
  monthlyStats: {
    month: string;
    patients: number;
    observations: number;
    assessments: number;
  }[];
  therapyBreakdown: {
    therapy: string;
    count: number;
    percentage: number;
  }[];
}

export default function LaporanPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, selectedYear]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Mock data - in real app, fetch from API
      const mockData: ReportData = {
        totalPatients: 45,
        totalTherapists: 8,
        totalObservations: 120,
        completedAssessments: 95,
        monthlyStats: [
          { month: "Januari", patients: 35, observations: 85, assessments: 72 },
          { month: "Februari", patients: 38, observations: 92, assessments: 78 },
          { month: "Maret", patients: 42, observations: 98, assessments: 82 },
          { month: "April", patients: 45, observations: 105, assessments: 88 },
          { month: "Mei", patients: 45, observations: 120, assessments: 95 },
        ],
        therapyBreakdown: [
          { therapy: "Fisioterapi", count: 25, percentage: 28 },
          { therapy: "Terapi Okupasi", count: 20, percentage: 22 },
          { therapy: "Terapi Wicara", count: 18, percentage: 20 },
          { therapy: "PLB (Paedagog)", count: 27, percentage: 30 },
        ]
      };

      setReportData(mockData);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Mock export functionality
    alert("Laporan berhasil diekspor!");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81B7A9] mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat laporan...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#36315B]">Laporan PuspaCare</h1>
              <p className="text-gray-600 mt-1">Ringkasan aktivitas dan statistik terapi</p>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
              >
                <option value="monthly">Bulanan</option>
                <option value="quarterly">Triwulanan</option>
                <option value="yearly">Tahunan</option>
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>

              <button
                onClick={exportReport}
                className="flex items-center gap-2 px-4 py-2 bg-[#81B7A9] text-white rounded-lg hover:bg-[#6d9d8a] transition-colors"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pasien</p>
                  <p className="text-3xl font-bold text-[#36315B]">{reportData?.totalPatients}</p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Terapis</p>
                  <p className="text-3xl font-bold text-[#36315B]">{reportData?.totalTherapists}</p>
                </div>
                <Activity className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Observasi</p>
                  <p className="text-3xl font-bold text-[#36315B]">{reportData?.totalObservations}</p>
                </div>
                <Calendar className="h-10 w-10 text-orange-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assessment Selesai</p>
                  <p className="text-3xl font-bold text-[#36315B]">{reportData?.completedAssessments}</p>
                </div>
                <FileText className="h-10 w-10 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Monthly Statistics Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-[#36315B] mb-4">Statistik Bulanan</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B]">
                    <th className="p-3 text-left">Bulan</th>
                    <th className="p-3 text-center">Pasien Aktif</th>
                    <th className="p-3 text-center">Observasi</th>
                    <th className="p-3 text-center">Assessment</th>
                    <th className="p-3 text-center">Tingkat Kelengkapan</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.monthlyStats.map((stat, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium">{stat.month} {selectedYear}</td>
                      <td className="p-3 text-center">{stat.patients}</td>
                      <td className="p-3 text-center">{stat.observations}</td>
                      <td className="p-3 text-center">{stat.assessments}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (stat.assessments / stat.observations * 100) >= 80
                            ? "bg-green-100 text-green-800"
                            : (stat.assessments / stat.observations * 100) >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {Math.round((stat.assessments / stat.observations) * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Therapy Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-[#36315B] mb-4">Breakdown Berdasarkan Terapi</h2>
            <div className="space-y-4">
              {reportData?.therapyBreakdown.map((therapy, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${
                      index === 0 ? "bg-blue-500" :
                      index === 1 ? "bg-green-500" :
                      index === 2 ? "bg-purple-500" : "bg-orange-500"
                    }`}></div>
                    <span className="font-medium text-[#36315B]">{therapy.therapy}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{therapy.count} pasien</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? "bg-blue-500" :
                          index === 1 ? "bg-green-500" :
                          index === 2 ? "bg-purple-500" : "bg-orange-500"
                        }`}
                        style={{ width: `${therapy.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#36315B] w-12">{therapy.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-[#36315B] mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Metrik Kinerja
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rata-rata Observasi per Pasien</span>
                  <span className="font-medium">2.7 sesi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tingkat Kelengkapan Assessment</span>
                  <span className="font-medium">79.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rata-rata Durasi Terapi</span>
                  <span className="font-medium">45 menit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tingkat Kepuasan</span>
                  <span className="font-medium">4.6/5.0</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-[#36315B] mb-4">Rekomendasi</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Tingkatkan frekuensi terapi okupasi untuk pasien dengan kesulitan motorik halus</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Perlu lebih banyak sesi fisioterapi untuk pasien dengan riwayat cedera</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Tambah kapasitas terapis wicara untuk mengakomodasi permintaan yang meningkat</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Evaluasi efektivitas program terapi paedagog setiap 3 bulan</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
