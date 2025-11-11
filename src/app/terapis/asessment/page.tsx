"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Clock3 } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useRouter } from "next/navigation";
import { getAssessmentsByStatus } from "@/lib/api/asesment";

type TerapiTab = "PLB (Paedagog)" | "Terapi Okupasi" | "Terapi Wicara" | "Fisioterapi";
type StatusFilter = "Terjadwal" | "Selesai";

interface Assessment {
  assessment_id: number;
  child_name: string;
  child_age: string;
  child_gender: string;
  guardian_name: string;
  guardian_phone: string;
  scheduled_date?: string;
  status: string;
}

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState<TerapiTab>("PLB (Paedagog)");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("Terjadwal");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Mapping jenis terapi ke key API dan route
  const getType = () => {
    switch (activeTab) {
      case "Terapi Okupasi":
        return "okupasi";
      case "Terapi Wicara":
        return "wicara";
      case "Fisioterapi":
        return "fisio";
      default:
        return "paedagog";
    }
  };

  // ✅ Ambil data dari API sesuai jenis terapi & status
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const status = activeFilter === "Terjadwal" ? "scheduled" : "completed";
        const data = await getAssessmentsByStatus(status, getType());
        setAssessments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Gagal memuat data asesmen:", error);
      }
      setLoading(false);
      setOpenDropdown(null);
    };
    fetchData();
  }, [activeTab, activeFilter]);

  // ✅ Fungsi redirect ke halaman form sesuai terapi
  const handleStartAssessment = (id: number) => {
    const type = getType();
    let route = "";

    switch (type) {
      case "paedagog":
        route = `/terapis/asessment/plbAsesment?assessment_id=${id}`;
        break;
      case "okupasi":
        route = `/terapis/asessment/okupasiAsesment?assessment_id=${id}`;
        break;
      case "wicara":
        route = `/terapis/asessment/wicaraAsesment?assessment_id=${id}`;
        break;
      case "fisio":
        route = `/terapis/asessment/fisioAsesment?assessment_id=${id}`;
        break;
      default:
        route = `/terapis/asessment/plbAsesment?assessment_id=${id}`;
    }

    router.push(route);
  };

  const toggleDropdown = (id: number) =>
    setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />
        <main className="p-6 flex-1 flex flex-col text-[#36315B]">
          {/* Tabs Jenis Terapi */}
          <div className="flex justify-start space-x-4 mb-6">
            {(["PLB (Paedagog)", "Terapi Okupasi", "Terapi Wicara", "Fisioterapi"] as TerapiTab[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-md font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? "border border-[#81B7A9] text-[#36315B] bg-white shadow-sm"
                      : "text-[#36315B]/70 hover:text-[#36315B]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Filter Status */}
          <div className="mb-4 border-b border-gray-200">
            <ul className="flex w-full text-sm font-semibold">
              {(["Terjadwal", "Selesai"] as StatusFilter[]).map((filter) => (
                <li
                  key={filter}
                  className={`pb-2 cursor-pointer flex-1 text-center transition-colors duration-200 ${
                    activeFilter === filter
                      ? "border-b-2 border-[#81B7A9] text-[#81B7A9]"
                      : "text-[#36315B]"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>

          {/* Tabel Data */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4">
            {loading ? (
              <p className="text-center py-4 text-gray-500">Memuat data...</p>
            ) : assessments.length === 0 ? (
              <p className="text-center py-4 text-gray-500">Tidak ada data asesmen.</p>
            ) : (
              <table className="min-w-full text-sm text-[#36315B] border-collapse">
                <thead className="bg-[#F8FAF9] border-b-2 border-[#81B7A9]">
                  <tr className="text-left">
                    {[
                      "Nama",
                      "Usia",
                      "Jenis Kelamin",
                      "Nama Wali",
                      "Telepon",
                      "Tanggal Asesmen",
                      "Aksi",
                    ].map((head) => (
                      <th key={head} className="px-3 py-2 font-semibold">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((item) => (
                    <tr
                      key={item.assessment_id}
                      className="border-t border-[#81B7A9] hover:bg-[#F8FAF9] transition"
                    >
                      <td className="px-3 py-2">{item.child_name}</td>
                      <td className="px-3 py-2">{item.child_age}</td>
                      <td className="px-3 py-2 capitalize">
                        {item.child_gender}
                      </td>
                      <td className="px-3 py-2">{item.guardian_name}</td>
                      <td className="px-3 py-2">{item.guardian_phone}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {item.scheduled_date || "-"}
                      </td>
                      <td className="px-3 py-2 relative">
                        <div className="flex justify-start">
                          <button
                            onClick={() => toggleDropdown(item.assessment_id)}
                            className="flex items-center gap-1 border border-[#81B7A9] text-[#81B7A9] rounded-md px-4 py-1 text-sm hover:bg-[#E9F4F1] transition"
                          >
                            Aksi <ChevronDown size={14} />
                          </button>
                        </div>

                        {/* Dropdown Aksi */}
                        <AnimatePresence>
                          {openDropdown === item.assessment_id && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute bg-white border border-[#81B7A9] shadow-md rounded-md right-0 mt-2 w-44 z-10 overflow-hidden"
                            >
                              {/* Tombol Mulai */}
                              <button
                                onClick={() =>
                                  handleStartAssessment(item.assessment_id)
                                }
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#E9F4F1] text-[#81B7A9] text-sm text-left"
                              >
                                <Play size={14} /> Mulai
                              </button>

                              <div className="border-t border-[#81B7A9]" />

                              {/* Tombol Riwayat Jawaban */}
                              <button
                                onClick={() =>
                                  router.push(
                                    `/terapis/asessment/${item.assessment_id}/answer?type=${getType()}`
                                  )
                                }
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#E9F4F1] text-[#81B7A9] text-sm text-left"
                              >
                                <Clock3 size={14} /> Riwayat Jawaban
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
