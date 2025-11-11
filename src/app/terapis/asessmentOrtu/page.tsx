"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useRouter } from "next/navigation";

type TerapiTab = "PLB (Paedagog)" | "Terapi Okupasi" | "Terapi Wicara" | "Fisioterapi";
type StatusFilter = "Terjadwal" | "Selesai";

interface Patient {
  nama: string;
  usia: string;
  jenisKelamin: string;
  namaOrangTua: string;
  telepon: string;
  status: string;
}

const patientsData: Record<TerapiTab, Patient[]> = {
  "PLB (Paedagog)": [
    {
      nama: "Prameswari",
      usia: "4 Tahun 11 Bulan",
      jenisKelamin: "Perempuan",
      namaOrangTua: "Ahmad",
      telepon: "0812349834",
      status: "Belum Assesmen",
    },
    {
      nama: "Raka",
      usia: "6 Tahun",
      jenisKelamin: "Laki-laki",
      namaOrangTua: "Budi",
      telepon: "0812223344",
      status: "Belum Assesmen",
    },
  ],
  "Terapi Okupasi": [
    {
      nama: "Nina",
      usia: "9 Tahun",
      jenisKelamin: "Perempuan",
      namaOrangTua: "Siti",
      telepon: "082298765432",
      status: "Sudah Assesmen",
    },
  ],
  "Terapi Wicara": [
    {
      nama: "Dimas",
      usia: "7 Tahun",
      jenisKelamin: "Laki-laki",
      namaOrangTua: "Andi",
      telepon: "081987654321",
      status: "Belum Assesmen",
    },
  ],
  "Fisioterapi": [
    {
      nama: "Fajar",
      usia: "11 Tahun",
      jenisKelamin: "Laki-laki",
      namaOrangTua: "Hendra",
      telepon: "0821122334455",
      status: "Sudah Assesmen",
    },
  ],
};

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState<TerapiTab>("PLB (Paedagog)");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("Terjadwal");
  const router = useRouter();
  const mainGreen = "#81B7A9";

  const filteredPatients = patientsData[activeTab].filter((p) =>
    activeFilter === "Terjadwal" ? p.status === "Belum Assesmen" : p.status === "Sudah Assesmen"
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />
        <main className="p-6 flex-1 flex flex-col">
          {/* Tabs Jenis Terapi */}
          <div className="flex justify-start space-x-4 mb-6">
            {(["PLB (Paedagog)", "Terapi Okupasi", "Terapi Wicara", "Fisioterapi"] as TerapiTab[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-md font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? "border border-[#81B7A9] text-[#36315B] shadow-sm"
                      : "text-[#36315B]/80 hover:text-[#36315B]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Filter Status */}
          <div className="mb-4 border-b border-gray-200">
            <ul className="flex w-full">
              {(["Terjadwal", "Selesai"] as StatusFilter[]).map((filter) => (
                <li
                  key={filter}
                  className={`pb-2 cursor-pointer flex-1 text-center transition-colors duration-200 ${
                    activeFilter === filter
                      ? "border-b-2 border-[#81B7A9] text-[#81B7A9] font-semibold"
                      : "text-[#36315B]"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>

          {/* Tabel Data Pasien */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeFilter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-lg relative"
            >
              <table className="min-w-full table-auto text-sm relative">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold text-[#36315B]">Nama</th>
                    <th className="px-4 py-3 font-semibold text-[#36315B]">Usia</th>
                    <th className="px-4 py-3 font-semibold text-[#36315B]">Jenis Kelamin</th>
                    <th className="px-4 py-3 font-semibold text-[#36315B]">Nama Orang Tua</th>
                    <th className="px-4 py-3 font-semibold text-[#36315B]">Telepon</th>
                    <th className="px-4 py-3 font-semibold text-[#36315B]">Tanggal Assessment</th>
                    <th className="px-4 py-3 font-semibold text-[#36315B]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50 transition relative"
                    >
                      <td className="px-4 py-2">{patient.nama}</td>
                      <td className="px-4 py-2">{patient.usia}</td>
                      <td className="px-4 py-2">{patient.jenisKelamin}</td>
                      <td className="px-4 py-2">{patient.namaOrangTua}</td>
                      <td className="px-4 py-2">{patient.telepon}</td>
                      <td className="px-4 py-2">12/10/2025</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => alert(`Lihat jawaban ${patient.nama}`)}
                          className="px-4 py-2 border rounded-md text-[#81B7A9] border-[#81B7A9] hover:bg-[#81B7A9]/10 transition-all duration-200"
                        >
                          Lihat Jawaban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>

          {/* Tombol Lanjut */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: mainGreen }}
              onClick={() => router.push("/terapis/assessment/detail")}
            >
              Lanjut
            </motion.button>
          </div>
        </main>
      </div>
    </div>
  );
}

