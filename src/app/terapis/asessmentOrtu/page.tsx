"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { ChevronDown } from "lucide-react";
import { getPendingParents, getCompletedParents } from "@/lib/api/asesmentParent";

type StatusFilter = "Terjadwal" | "Selesai";

interface Patient {
  id: number;
  assessment_id: number;
  child_name: string;
  guardian_name: string;
  guardian_phone: string;
  type: string;
  administrator: string;
  scheduled_date: string;
  scheduled_time: string;
  parent_completed_at: string | null;
  status: string;
}

export default function AssessmentPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("Terjadwal");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // 🔍 SEARCH STATES
  const [searchName, setSearchName] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ======================
  // FETCH DATA API
  // ======================
  const fetchData = async () => {
    setLoading(true);

    try {
      let data;

      if (activeFilter === "Terjadwal") {
        data = await getPendingParents(dateFilter, searchName);
      } else {
        data = await getCompletedParents(dateFilter, searchName);
      }

      setPatients(data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }

    setLoading(false);
  };

  // AUTO FETCH setiap filter berubah
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 300); // debounce search 300ms

    return () => clearTimeout(delay);
  }, [activeFilter, searchName, dateFilter]);

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />

        <main className="p-6 flex-1">

          {/* ==========================
              SEARCH BAR & FILTER TANGGAL
          =========================== */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            
            {/* Search Name */}
            <input
              type="text"
              placeholder="Cari nama pasien..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/3"
            />

            {/* Filter Tanggal */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4"
            />
          </div>

          {/* FILTER STATUS */}
          <div className="mb-4 border-b border-gray-300">
            <ul className="flex w-full">
              {(["Terjadwal", "Selesai"] as StatusFilter[]).map((filter) => (
                <li
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 text-center py-2 cursor-pointer ${
                    activeFilter === filter
                      ? "text-[#81B7A9] font-semibold border-b-2 border-[#81B7A9]"
                      : "text-gray-500"
                  }`}
                >
                  {filter === "Terjadwal" ? "Belum Selesai" : "Selesai"}
                </li>
              ))}
            </ul>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-10 text-gray-600">
              Memuat data...
            </div>
          )}

          {/* TABEL */}
          {!loading && (
            <div className="bg-white shadow-md rounded-lg p-4">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr className="text-left text-[#36315B]">
                    <th className="px-4 py-3">Nama Pasien</th>
                    <th className="px-4 py-3">Nama Orangtua</th>
                    <th className="px-4 py-3">Telepon</th>
                    <th className="px-4 py-3">Tipe Assessment</th>
                    <th className="px-4 py-3">Administrator</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-gray-500">
                        Tidak ada data
                      </td>
                    </tr>
                  )}

                  {patients.map((row, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 relative">
                      <td className="px-4 py-3">{row.child_name}</td>
                      <td className="px-4 py-3">{row.guardian_name}</td>
                      <td className="px-4 py-3">{row.guardian_phone}</td>
                      <td className="px-4 py-3">{row.type}</td>
                      <td className="px-4 py-3">{row.administrator}</td>
                      <td className="px-4 py-3">{row.scheduled_date}</td>
                      <td className="px-4 py-3">{row.scheduled_time}</td>

                      {/* BUTTON AKSI */}
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#81B7A9] text-white rounded-md text-sm"
                        >
                          Aksi <ChevronDown size={14} />
                        </button>

                        {/* DROPDOWN */}
                        <AnimatePresence>
                          {openDropdownIndex === index && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden border z-20"
                            >
                              {[
                                "Data Umum",
                                "Data Fisioterapi",
                                "Data Terapi Okupasi",
                                "Data Terapi Wicara",
                                "Data Paedagog",
                              ].map((item, i) => (
                                <button
                                  key={i}
                                  className="w-full text-left px-4 py-2 text-[#3B817C] hover:bg-gray-100"
                                  onClick={() => alert(`${item} untuk ${row.child_name}`)}
                                >
                                  {item}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
