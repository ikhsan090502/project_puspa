"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import {
  getScheduledObservations,
  getScheduledObservationDetail,
} from "@/lib/api/observasiTerapis";

interface Anak {
  observation_id: string | number;
  child_name: string;
  child_gender: string;
  child_age: string;
  child_school: string;
  scheduled_date?: string;
   time?: string; 
}

interface Kategori {
  title: string;
  filter: (d: Anak) => boolean;
}

const getTahun = (usia: string): number => {
  if (!usia) return 0;
  const match = usia.match(/(\d+)\s*Tahun/);
  return match ? parseInt(match[1], 10) : 0;
};

// Kategori tab
const kategori: Kategori[] = [
  { title: "Usia 0-5 Tahun", filter: (d) => getTahun(d.child_age) <= 5 },
  {
    title: "Usia 6-12 Tahun",
    filter: (d) => getTahun(d.child_age) >= 6 && getTahun(d.child_age) <= 12,
  },
  {
    title: "Usia 13-17 Tahun",
    filter: (d) => getTahun(d.child_age) >= 13 && getTahun(d.child_age) <= 17,
  },
  { title: "Usia 17+ Tahun", filter: (d) => getTahun(d.child_age) > 17 },
];

const getKategoriByUsia = (usia: string): string => {
  const tahun = getTahun(usia);
  if (tahun <= 5) return "balita";
  if (tahun <= 12) return "anak-anak";
  if (tahun <= 17) return "remaja";
  return "dewasa";
};

export default function ObservasiPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Anak | null>(null);
  const [activeKategori, setActiveKategori] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailObservasi, setDetailObservasi] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["observations", "scheduled"],
    queryFn: getScheduledObservations,
  });

  // Normalisasi data agar id selalu ada
 const children: Anak[] = Array.isArray(data?.data)
  ? data.data.map((d: any, i: number) => ({
      ...d,
      id: d.id || `temp-${i}`, // fallback untuk key unik
      time: d.scheduled_time || "-", // ambil scheduled_time dari API, bukan time
    }))
  : [];


  const filtered = children.filter((d) => kategori[activeKategori].filter(d));

  // ✅ Gunakan observation_id untuk navigasi ke form observasi
  const handleStartObservasi = (child: Anak) => {
    const kategoriUsia = getKategoriByUsia(child.child_age);

    router.push(
      `/terapis/observasi/form_observasi?observation_id=${child.observation_id}&nama=${child.child_name}&usia=${child.child_age}&kategori=${kategoriUsia}&tglObservasi=${child.scheduled_date}`
    );
  };

  const handleViewDetail = async (observation_id: string | number) => {
    setLoadingDetail(true);
    try {
      const res = await getScheduledObservationDetail(String(observation_id));
      setDetailObservasi(res);
      setSelected(null);
    } catch (err) {
      console.error("❌ Gagal ambil detail observasi:", err);
      alert("Gagal memuat detail observasi");
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:static sm:shadow-md`}
      >
        <SidebarTerapis
          activePage="observasi"
          isMobile={true}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Konten Utama */}
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <div className="sm:hidden p-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-[#36315B] hover:bg-gray-200"
          >
            <Menu size={24} />
          </button>
        </div>

        <main className="p-4 sm:p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg sm:text-2xl font-bold">
              Pilih Anak Untuk Observasi
            </h2>
            <button
              onClick={() => router.push("/terapis/observasi/riwayat")}
              className="bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold px-3 py-2 rounded-lg text-sm sm:text-base"
            >
              Riwayat
            </button>
          </div>

          {/* Tabs kategori usia */}
          <div className="relative flex flex-wrap border-b border-gray-300 mb-4">
            {kategori.map((kat, idx) => (
              <button
                key={kat.title} // ✅ key unik per kategori
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
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#81B7A9]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tabel anak */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKategori}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-lg p-3 sm:p-4 border border-[#E4E4E4] overflow-x-auto"
            >
              {isLoading ? (
                <p className="text-center py-4">Memuat data...</p>
              ) : isError ? (
                <p className="text-center py-4 text-red-500">
                  Gagal memuat data
                </p>
              ) : filtered.length === 0 ? (
                <p className="text-center py-4 text-[#36315B]">
                  Tidak ada data observasi terjadwal
                </p>
              ) : (
                <table className="w-full text-xs sm:text-sm table-auto border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#81B7A9] bg-gray-100">
                      <th className="py-2 px-4 text-center">Nama</th>
                      <th className="py-2 px-4 text-center">Jenis Kelamin</th>
                      <th className="py-2 px-4 text-center">Usia</th>
                      <th className="py-2 px-4 text-center">Sekolah</th>
                      <th className="py-2 px-4 text-center">
                        Tanggal Observasi
                      </th>
                      <th className="py-2 px-4 text-center">Waktu</th>
                      <th className="py-2 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, index) => (
                      <tr
                        key={d.observation_id ? String(d.observation_id) : `row-${index}`} // ✅ Fix: key selalu unik
                        className={`border-b border-[#81B7A9] hover:bg-gray-50 ${
                          selected?.observation_id === d.observation_id ? "bg-[#C0DCD6]" : ""
                        }`}
                      >
                        <td className="py-2 px-4 text-center">
                          {d.child_name}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {d.child_gender}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {d.child_age}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {d.child_school}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {d.scheduled_date || "-"}
                        </td>
                        <td className="py-2 px-4 text-center">{d.time || "-"} </td>
                        <td className="py-2 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="bg-[#81B7A9] hover:bg-[#36315B] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded"
                              onClick={() => handleStartObservasi(d)}
                            >
                              Mulai
                            </button>
                            <button
                              className="p-1 text-[#81B7A9] hover:text-[#36315B]"
                              onClick={() => handleViewDetail(d.observation_id)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Modal Detail Observasi */}
          <AnimatePresence>
            {(loadingDetail || detailObservasi) && (
              <motion.div
                className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
                >
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    onClick={() => setDetailObservasi(null)}
                  >
                    ✕
                  </button>

                  {loadingDetail ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg sm:text-xl font-bold text-[#36315B] mb-4">
                        Detail Observasi
                      </h3>
                      <hr className="mb-4 border-[#81B7A9]" />

                      <div className="text-xs sm:text-sm space-y-3 mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">Data Anak</h4>
                          <ul className="list-disc ml-6 space-y-1">
                            <li>
                              Nama Lengkap:{" "}
                              {detailObservasi?.child_name || "-"}
                            </li>
                            <li>
                              Tanggal Lahir:{" "}
                              {detailObservasi?.child_birth_date || "-"}
                            </li>
                            <li>
                              Usia: {detailObservasi?.child_age || "-"}
                            </li>
                            <li>
                              Jenis Kelamin:{" "}
                              {detailObservasi?.child_gender || "-"}
                            </li>
                            <li>
                              Sekolah: {detailObservasi?.child_school || "-"}
                            </li>
                            <li>
                              Alamat: {detailObservasi?.child_address || "-"}
                            </li>
                            <li>
                              Tanggal Observasi:{" "}
                              {detailObservasi?.scheduled_date || "-"}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">
                            Informasi Orangtua / Wali
                          </h4>
                          <ul className="list-disc ml-6 space-y-1">
                            <li>
                              Nama Orangtua:{" "}
                              {detailObservasi?.parent_name || "-"}
                            </li>
                            <li>
                              Hubungan: {detailObservasi?.parent_type || "-"}
                            </li>
                            <li>
                              Nomor WhatsApp:{" "}
                              {detailObservasi?.parent_phone || "-"}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Keluhan</h4>
                          <p className="ml-4">
                            {detailObservasi?.child_complaint ||
                              "Tidak ada keluhan"}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Jenis Layanan</h4>
                          <p className="ml-4">
                            {detailObservasi?.child_service_choice || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          className="px-3 sm:px-4 py-2 bg-[#81B7A9] text-white rounded hover:bg-[#36315B] text-sm sm:text-base"
                          onClick={() => setDetailObservasi(null)}
                        >
                          Tutup
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
