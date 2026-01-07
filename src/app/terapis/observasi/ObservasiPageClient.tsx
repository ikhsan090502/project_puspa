"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { ChevronDown, Settings, Clock3, Eye } from "lucide-react";
import { getObservations } from "@/lib/api/observasiSubmit";

// ==================== Interface ====================
interface Anak {
  observation_id: string;
  nama: string;
  orangTua: string;
  telepon: string;
  observer: string;
  kategoriUsia: string;
  tglObservasi: string; // yyyy-mm-dd
  waktu: string;
  child_age: string;
}

interface Kategori {
  title: string;
  filter: (d: Anak) => boolean;
}

// ==================== Parsing usia ====================
const parseChildAgeYear = (ageText: string): number => {
  if (!ageText) return 0;

  // contoh: "6 Tahun", "6 Tahun 3 Bulan"
  const matchYear = ageText.match(/(\d+)\s*Tahun/i);
  if (matchYear) return parseInt(matchYear[1], 10);

  // kalau cuma bulan: "18 Bulan" -> 1 tahun
  const matchMonth = ageText.match(/(\d+)\s*Bulan/i);
  if (matchMonth) {
    const m = parseInt(matchMonth[1], 10);
    return Math.floor(m / 12);
  }

  return 0;
};

// ==================== Kategori ====================
const kategori: Kategori[] = [
  { title: "Usia 0–5 Tahun", filter: (d) => parseChildAgeYear(d.child_age) >= 0 && parseChildAgeYear(d.child_age) <= 5 },
  { title: "Usia 6–12 Tahun", filter: (d) => parseChildAgeYear(d.child_age) >= 6 && parseChildAgeYear(d.child_age) <= 12 },
  { title: "Usia 13–17 Tahun", filter: (d) => parseChildAgeYear(d.child_age) >= 13 && parseChildAgeYear(d.child_age) <= 17 },
  { title: "Usia 17+ Tahun", filter: (d) => parseChildAgeYear(d.child_age) > 17 },
];

export default function RiwayatObservasiPageClient() {
  const router = useRouter();

  const [activeKategori, setActiveKategori] = useState(0);
  const [data, setData] = useState<Anak[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  // Filter
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchObservasi = async () => {
    try {
      setLoading(true);

      const result = await getObservations("completed");

      const mapped: Anak[] =
        result?.map((item: any) => {
          const [dd, mm, yyyy] = item.scheduled_date?.split("/") || ["-", "-", "-"];
          const tglObservasi = `${yyyy}-${String(mm || "").padStart(2, "0")}-${String(dd || "").padStart(2, "0")}`;

          return {
            observation_id: item.observation_id?.toString() || "-",
            nama: item.child_name || "-",
            orangTua: item.guardian_name || "-",
            telepon: item.guardian_phone || "-",
            observer: item.observer || "-",
            kategoriUsia: item.age_category || "-",
            child_age: item.child_age || "-",
            tglObservasi,
            waktu: item.time || "-",
          };
        }) || [];

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

    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // ==================== Filtering ====================
  const filtered = useMemo(() => {
    // reset page saat filter berubah
    setPage(1);

    return data
      .filter((d) => kategori[activeKategori].filter(d))
      .filter((d) => (searchName ? d.nama.toLowerCase().includes(searchName.toLowerCase()) : true))
      .filter((d) => (filterDate ? d.tglObservasi === filterDate : true));
  }, [data, activeKategori, searchName, filterDate]);

  // ==================== Pagination ====================
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  // ==================== Routes (KUNCI PERBAIKAN) ====================
  // Kirim DUA param: observation_id dan id (biar halaman tujuan aman baca mana pun)
  const handleRiwayatJawaban = (observationId: string) => {
    router.push(`/terapis/riwayat-hasil?observation_id=${encodeURIComponent(observationId)}&id=${encodeURIComponent(observationId)}`);
  };

  const handleLihatHasil = (observationId: string) => {
    router.push(`/terapis/hasil-observasi?observation_id=${encodeURIComponent(observationId)}&id=${encodeURIComponent(observationId)}`);
  };

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />

      <div className="flex flex-col flex-1 bg-gray-50">
        {/* FIX: pakai pageTitle biar tidak fallback ke Dashboard */}
        <HeaderTerapis pageTitle="Observasi" />

        <main className="p-4 sm:p-6 overflow-y-auto">
          <button
            onClick={() => router.push("/terapis/observasi")}
            className="mb-4 px-4 py-2 text-sm font-semibold text-[#36315B] border border-[#81B7A9] rounded hover:bg-[#81B7A9] hover:text-white transition"
          >
            Kembali
          </button>

          <h2 className="text-lg sm:text-2xl font-bold text-center mb-6">Riwayat Observasi</h2>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-5">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-[#81B7A9] rounded px-3 py-2 text-sm"
            />

            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-[#81B7A9] rounded px-3 py-2 text-sm max-w-[240px]"
              placeholder="Cari Nama Anak"
            />
          </div>

          {/* Tabs */}
          <div className="relative flex flex-wrap border-b border-gray-300 mb-4">
            {kategori.map((kat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveKategori(idx)}
                className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors ${
                  activeKategori === idx ? "text-[#36315B]" : "text-gray-500 hover:text-[#36315B]"
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

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
              <div className="w-10 h-10 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3" />
              <p>Memuat riwayat observasi...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={String(activeKategori) + searchName + filterDate + String(page)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white shadow-md rounded-lg p-3 sm:p-4 border border-[#E4E4E4] overflow-x-auto"
              >
                <table className="w-full text-xs sm:text-sm table-auto border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-[#81B7A9] bg-gray-100">
                      <th className="py-2 text-center">Nama Anak</th>
                      <th className="py-2 text-center">Orang Tua</th>
                      <th className="py-2 text-center">Telepon</th>
                      <th className="py-2 text-center">Observer</th>
                      <th className="py-2 text-center">Tanggal</th>
                      <th className="py-2 text-center">Waktu</th>
                      <th className="py-2 text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((d) => (
                        <tr key={d.observation_id} className="border-b border-[#81B7A9] hover:bg-gray-50">
                          <td className="py-2 text-center">{d.nama}</td>
                          <td className="py-2 text-center">{d.orangTua}</td>
                          <td className="py-2 text-center">{d.telepon}</td>
                          <td className="py-2 text-center">{d.observer}</td>
                          <td className="py-2 text-center">{d.tglObservasi}</td>
                          <td className="py-2 text-center">{d.waktu}</td>

                          <td className="py-2 text-center relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                const rect = e.currentTarget.getBoundingClientRect();
                                const nextOpen = openDropdown === d.observation_id ? null : d.observation_id;

                                setOpenDropdown(nextOpen);

                                if (nextOpen) {
                                  setDropdownPosition({
                                    top: rect.bottom + 6 + window.scrollY,
                                    left: rect.left - 120 + window.scrollX,
                                  });
                                } else {
                                  setDropdownPosition(null);
                                }
                              }}
                              className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded hover:bg-[#E9F4F1] text-xs inline-flex items-center"
                            >
                              <Settings size={14} className="mr-1" />
                              Aksi
                              <ChevronDown size={12} className="ml-1" />
                            </button>

                            {openDropdown === d.observation_id && dropdownPosition && (
                              <div
                                className="fixed z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-md border border-[#80C2B0]"
                                style={{
                                  top: dropdownPosition.top,
                                  left: dropdownPosition.left,
                                }}
                                onClick={(e) => e.stopPropagation()}
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
                        <td colSpan={7} className="text-center py-4 text-gray-500">
                          Tidak ada data observasi completed.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {filtered.length > 0 && (
                  <div className="flex justify-center items-center gap-3 mt-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={`px-3 py-1 rounded border ${
                        page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      Prev
                    </button>

                    <span className="text-sm font-medium">
                      Page {page} / {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={`px-3 py-1 rounded border ${
                        page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
