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

      const result = await getObservations("scheduled"); // Changed from "completed" to show upcoming

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
      alert("Gagal mengambil daftar observasi.");
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

    const matchActiveKategori = (d: Anak) => {
      if (activeKategori === 0) return true; // Semua
      const kat = kategori[activeKategori];
      if (kat.title === "Dini") return d.kategoriUsia === "dini";
      if (kat.title === "Prasekolah") return d.kategoriUsia === "prasekolah";
      if (kat.title === "Sekolah") return d.kategoriUsia === "sekolah";
      return true;
    };

    return data
      .filter(matchActiveKategori)
      .filter((d) => (searchName ? d.nama.toLowerCase().includes(searchName.toLowerCase()) : true))
      .filter((d) => (filterDate ? d.tglObservasi === filterDate : true));
  }, [data, activeKategori, searchName, filterDate]);

  // ==================== Pagination ====================
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  // ==================== Actions ====================
  const handleStartObservasi = (anak: Anak) => {
    router.push(
      `/terapis/observasi/form_observasi?observation_id=${anak.observation_id}&nama=${encodeURIComponent(anak.nama)}&usia=${encodeURIComponent(anak.child_age)}&tglObservasi=${encodeURIComponent(anak.tglObservasi)}`
    );
  };

  const handleRiwayat = () => {
    router.push("/terapis/observasi/riwayat");
  };

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis pageTitle="Observasi" />

        <main className="p-4 sm:p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-2xl font-bold">Pilih Anak Untuk Observasi</h2>
            <button
              onClick={handleRiwayat}
              className="px-4 py-2 bg-[#81B7A9] text-white rounded hover:bg-[#36315B] transition font-semibold"
            >
              Riwayat
            </button>
          </div>

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
                className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors ${activeKategori === idx ? "text-[#36315B]" : "text-gray-500 hover:text-[#36315B]"
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
                        <tr key={d.observation_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-center font-medium">{d.nama}</td>
                          <td className="py-3 px-4 text-center">{d.orangTua}</td>
                          <td className="py-3 px-4 text-center">{d.telepon}</td>
                          <td className="py-3 px-4 text-center">{d.observer}</td>
                          <td className="py-3 px-4 text-center">{d.tglObservasi}</td>
                          <td className="py-3 px-4 text-center">{d.waktu}</td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleStartObservasi(d)}
                              className="px-4 py-1.5 bg-[#81B7A9] text-white rounded hover:bg-[#36315B] transition text-xs font-semibold"
                            >
                              Mulai
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-gray-400">
                          Tidak ada jadwal observasi untuk kategori ini.
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
                      className={`px-3 py-1 rounded border ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
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
                      className={`px-3 py-1 rounded border ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
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
