"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { ChevronDown, Settings, Clock3, Eye } from "lucide-react";
import { getCompletedObservations } from "@/lib/api/observasiSubmit";
import DatePicker from "@/components/dashboard/datepicker";

// ==================== Interface ====================
interface Anak {
  observation_id: string;
  nama: string;
  observer: string;
  usia: string;
  sekolah: string;
  tglObservasi: string;
  waktu: string; // ← tambahan field waktu
  status?: string;
}

interface Kategori {
  title: string;
  filter: (d: Anak) => boolean;
}

// ==================== Util ====================
const getTahun = (usia: string): number => {
  const parts = usia.split(" ");
  return parseInt(parts[0], 10) || 0;
};

// ==================== Kategori Usia ====================
const kategori: Kategori[] = [
  { title: "Usia 0–5 Tahun", filter: (d) => getTahun(d.usia) <= 5 },
  { title: "Usia 6–12 Tahun", filter: (d) => getTahun(d.usia) >= 6 && getTahun(d.usia) <= 12 },
  { title: "Usia 13–17 Tahun", filter: (d) => getTahun(d.usia) >= 13 && getTahun(d.usia) <= 17 },
  { title: "Usia 17+ Tahun", filter: (d) => getTahun(d.usia) > 17 },
];

// ==================== Komponen Utama ====================
export default function RiwayatObservasiPage() {
  const router = useRouter();
  const [activeKategori, setActiveKategori] = useState(0);
  const [data, setData] = useState<Anak[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<Anak | null>(null);

  // ==================== Fetch Data ====================
  const fetchObservasi = async () => {
    try {
      setLoading(true);
      const result = await getCompletedObservations();

      const mapped =
        result?.map((item: any) => ({
          observation_id: item.observation_id?.toString() || item.id?.toString(),
          nama: item.child_name,
          observer: item.observer,
          usia: item.child_age,
          sekolah: item.child_school,
          tglObservasi: item.scheduled_date,
          waktu: item.time || "-", // ← tambahkan waktu observasi
          status: item.status,
        })) || [];

      setData(mapped);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil riwayat observasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservasi();
  }, []);

  const filtered = data.filter((d) => kategori[activeKategori].filter(d));

  const handleRiwayatJawaban = (id: string) => {
    router.push(`/terapis/riwayat-hasil?id=${id}`);
  };

  const handleLihatHasil = (id: string) => {
    router.push(`/terapis/hasil-observasi?id=${id}`);
  };

  // ==================== UI ====================
  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-4 sm:p-6 overflow-y-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-sm font-semibold text-[#36315B] border border-[#81B7A9] rounded hover:bg-[#81B7A9] hover:text-white transition"
          >
            Kembali
          </button>

          <h2 className="text-lg sm:text-2xl font-bold text-center mb-6">
            Riwayat Observasi
          </h2>

          {/* Tab Kategori Usia */}
          <div className="relative flex flex-wrap border-b border-gray-300 mb-4">
            {kategori.map((kat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveKategori(idx)}
                className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors ${
                  activeKategori === idx
                    ? "text-[#36315B]"
                    : "text-gray-500 hover:text-[#36315B]"
                }`}
              >
                {kat.title}
                {activeKategori === idx && (
                  <motion.div
                    layoutId="underline-riwayat"
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#81B7A9]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
              <div className="w-10 h-10 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Memuat riwayat observasi...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKategori}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-md rounded-lg p-3 sm:p-4 border border-[#E4E4E4] overflow-x-auto"
              >
                <table className="w-full text-xs sm:text-sm table-auto border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#81B7A9] bg-gray-100">
                      <th className="text-center py-2 px-2 sm:px-4">Nama</th>
                      <th className="text-center py-2 px-2 sm:px-4">Observer</th>
                      <th className="text-center py-2 px-2 sm:px-4">Usia</th>
                      <th className="text-center py-2 px-2 sm:px-4">Sekolah</th>
                      <th className="text-center py-2 px-2 sm:px-4">Tanggal Observasi</th>
                      <th className="text-center py-2 px-2 sm:px-4">Waktu</th>
                      <th className="text-center py-2 px-2 sm:px-4">Status</th>
                      <th className="text-center py-2 px-2 sm:px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((d, i) => (
                        <tr key={i} className="border-b border-[#81B7A9] hover:bg-gray-50">
                          <td className="py-2 px-2 sm:px-4 text-center">{d.nama}</td>
                          <td className="py-2 px-2 sm:px-4 text-center">{d.observer}</td>
                          <td className="py-2 px-2 sm:px-4 text-center">{d.usia}</td>
                          <td className="py-2 px-2 sm:px-4 text-center">{d.sekolah}</td>
                           <td className="py-2 px-2 sm:px-4 text-center">{d.tglObservasi}</td>
                            <td className="py-2 px-2 sm:px-4 text-center">{d.waktu}</td>
                          <td className="py-2 px-2 sm:px-4 text-center capitalize">{d.status}</td>
                          <td className="py-2 px-2 sm:px-4 text-center relative">
                            <div className="relative inline-block text-left">
                              <button
                                type="button"
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setOpenDropdown(openDropdown === d.observation_id ? null : d.observation_id);
                                  if (openDropdown !== d.observation_id) {
                                    setDropdownPosition({
                                      top: rect.bottom + window.scrollY + 6,
                                      left: rect.left + window.scrollX - 120,
                                    });
                                  }
                                }}
                                className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded hover:bg-[#E9F4F1] text-xs inline-flex items-center"
                              >
                                <Settings size={14} className="mr-1" />
                                Aksi
                                <ChevronDown size={12} className="ml-1" />
                              </button>
                            </div>

                            {/* Dropdown fixed */}
                            {openDropdown === d.observation_id && dropdownPosition && (
                              <div
                                className="fixed z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-md border border-[#80C2B0]"
                                style={{
                                  top: dropdownPosition.top,
                                  left: dropdownPosition.left,
                                }}
                                onMouseLeave={() => setOpenDropdown(null)}
                              >
                                <div className="py-1 text-[#5F52BF]">
                                  <button
                                    onClick={() => handleRiwayatJawaban(d.observation_id)}
                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-[#E9F4F1]"
                                  >
                                    <Clock3 size={16} className="mr-2" />
                                    Riwayat Jawaban
                                  </button>
                                  <button
                                    onClick={() => handleLihatHasil(d.observation_id)}
                                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-[#E9F4F1]"
                                  >
                                    <Eye size={16} className="mr-2" />
                                    Lihat Hasil
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-3 px-4 text-gray-500 text-sm">
                          Tidak ada data observasi completed.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
