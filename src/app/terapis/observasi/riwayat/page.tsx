"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

interface Anak {
  nama: string;
  observer: string;
  usia: string;
  sekolah: string;
  tglObservasi: string;
}

interface Kategori {
  title: string;
  filter: (d: Anak) => boolean;
}

const data: Anak[] = [
  {
    nama: "Zam zam",
    observer: "Annisa",
    usia: "2 Tahun 5 Bulan",
    sekolah: "-",
    tglObservasi: "11/09/2025",
  },
  {
    nama: "Yusuf",
    observer: "Habib",
    usia: "4 Tahun 11 Bulan",
    sekolah: "TK B",
    tglObservasi: "11/09/2025",
  },
  {
    nama: "Furqon",
    observer: "Annisa",
    usia: "7 Tahun 5 Bulan",
    sekolah: "SD Kelas 1",
    tglObservasi: "11/09/2025",
  },
];

const getTahun = (usia: string): number => {
  const parts = usia.split(" ");
  return parseInt(parts[0], 10) || 0;
};

const kategori: Kategori[] = [
  { title: "Usia 0-5 Tahun", filter: (d) => getTahun(d.usia) <= 5 },
  {
    title: "Usia 6-12 Tahun",
    filter: (d) => getTahun(d.usia) >= 6 && getTahun(d.usia) <= 12,
  },
  {
    title: "Usia 13-17 Tahun",
    filter: (d) => getTahun(d.usia) >= 13 && getTahun(d.usia) <= 17,
  },
  { title: "Usia 17+ Tahun", filter: (d) => getTahun(d.usia) > 17 },
];

export default function RiwayatObservasiPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Anak | null>(null);
  const [activeKategori, setActiveKategori] = useState(0);

  const filtered = data.filter((d) => kategori[activeKategori].filter(d));

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-4 sm:p-6 overflow-y-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-sm font-semibold text-[#36315B] border border-[#81B7A9] rounded hover:bg-[#81B7A9] hover:text-white"
          >
            Kembali
          </button>

          <h2 className="text-lg sm:text-2xl font-bold text-center mb-6">
            Riwayat Observasi
          </h2>

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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeKategori}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-lg p-3 sm:p-4 border border-[#E4E4E4] overflow-x-auto"
            >
              <table className="w-full text-xs sm:text-sm table-auto border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#81B7A9] bg-gray-100">
                    <th className="text-center py-2 px-2 sm:px-4">Nama</th>
                    <th className="text-center py-2 px-2 sm:px-4">Observer</th>
                    <th className="text-center py-2 px-2 sm:px-4">Usia</th>
                    <th className="text-center py-2 px-2 sm:px-4">Sekolah</th>
                    <th className="text-center py-2 px-2 sm:px-4">
                      Tanggal Observasi
                    </th>
                    <th className="text-center py-2 px-2 sm:px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((d, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#81B7A9] hover:bg-gray-50"
                      >
                        <td className="py-2 px-2 sm:px-4 text-center">
                          {d.nama}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-center">
                          {d.observer}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-center">
                          {d.usia}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-center">
                          {d.sekolah}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-center">
                          {d.tglObservasi}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-center">
                          <button
                            className="border border-[#81B7A9] text-[#81B7A9] hover:bg-[#81B7A9] hover:text-white text-xs px-3 py-1 rounded transition"
                            onClick={() => setSelected(d)}
                          >
                            Hasil
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-3 px-4 text-gray-500 text-sm"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>

          {selected && (
             <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 px-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
              >
                <h3 className="text-xl font-bold mb-4">Hasil Observasi</h3>
                <hr className="mb-4 border-[#81B7A9]" />
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Nama: {selected.nama}</li>
                  <li>Observer: {selected.observer}</li>
                  <li>Usia: {selected.usia}</li>
                  <li>Sekolah: {selected.sekolah}</li>
                  <li>Tanggal Observasi: {selected.tglObservasi}</li>
                </ul>
                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 bg-[#81B7A9] text-white rounded hover:bg-[#36315B]"
                    onClick={() => setSelected(null)}
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
