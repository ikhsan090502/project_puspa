"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

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
    { nama: "Alya", usia: "10 Tahun 3 Bulan", jenisKelamin: "Perempuan", namaOrangTua: "Sahroni", telepon: "082109872345", status: "Belum Assesmen" },
    { nama: "Raka", usia: "8 Tahun", jenisKelamin: "Laki-laki", namaOrangTua: "Budi", telepon: "08123456789", status: "Belum  Assesmen" },
  ],
  "Terapi Okupasi": [
    { nama: "Nina", usia: "9 Tahun", jenisKelamin: "Perempuan", namaOrangTua: "Siti", telepon: "082298765432", status: "Sudah Assesmen" },
    { nama: "Nina", usia: "9 Tahun", jenisKelamin: "Perempuan", namaOrangTua: "Siti", telepon: "082298765432", status: "Sudah Assesmen" },
  ],
  "Terapi Wicara": [
    { nama: "Dimas", usia: "7 Tahun", jenisKelamin: "Laki-laki", namaOrangTua: "Andi", telepon: "081987654321", status: "Belum Assesmen" },
  ],
  "Fisioterapi": [
    { nama: "Fajar", usia: "11 Tahun", jenisKelamin: "Laki-laki", namaOrangTua: "Hendra", telepon: "0821122334455", status: "Sudah Assesmen" },
  ],
};

export default function AssessmentPage() {
  const tabs: TerapiTab[] = Object.keys(patientsData) as TerapiTab[];
  const statusFilters: StatusFilter[] = ["Terjadwal", "Selesai"];
  const [activeTab, setActiveTab] = useState<TerapiTab>(tabs[0]);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("Terjadwal");

  const mainGreen = "#81B7A9";
  const fontColor = "#36315B";

  const filteredPatients = patientsData[activeTab].filter(patient =>
    activeFilter === "Terjadwal" ? patient.status === "Belum Assesmen" : patient.status === "Sudah Assesmen"
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />

      <div className="flex-1 flex flex-col">
        <HeaderTerapis />

        <main className="p-6 flex-1 flex flex-col">

          <div className="mb-2 border-b border-gray-200">
            <ul className="flex space-x-6">
              {tabs.map(tab => (
                <li
                  key={tab}
                  className="pb-2 cursor-pointer transition-colors duration-200"
                  style={{
                    borderBottom: activeTab === tab ? `2px solid ${mainGreen}` : "none",
                    color: activeTab === tab ? mainGreen : fontColor,
                    fontWeight: activeTab === tab ? 600 : 500
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 border-b border-gray-200">
            <ul className="flex w-full">
              {statusFilters.map(filter => (
                <li
                  key={filter}
                  className="pb-2 cursor-pointer transition-colors duration-200 flex-1 text-center"
                  style={{
                    borderBottom: activeFilter === filter ? `2px solid ${mainGreen}` : "none",
                    color: activeFilter === filter ? mainGreen : fontColor,
                    fontWeight: activeFilter === filter ? 600 : 500
                  }}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeFilter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow rounded-lg overflow-x-auto"
            >
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: fontColor }}>Nama</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: fontColor }}>Usia</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: fontColor }}>Jenis Kelamin</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: fontColor }}>Nama Orang Tua</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: fontColor }}>Telepon</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: fontColor }}>Status</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: fontColor }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      style={{ cursor: "pointer", borderBottom: `1px solid ${mainGreen}` }}
                    >
                      <td className="px-4 py-2" style={{ color: fontColor, fontWeight: 500 }}>{patient.nama}</td>
                      <td className="px-4 py-2" style={{ color: fontColor, fontWeight: 400 }}>{patient.usia}</td>
                      <td className="px-4 py-2" style={{ color: fontColor, fontWeight: 400 }}>{patient.jenisKelamin}</td>
                      <td className="px-4 py-2" style={{ color: fontColor, fontWeight: 500 }}>{patient.namaOrangTua}</td>
                      <td className="px-4 py-2" style={{ color: fontColor, fontWeight: 400 }}>{patient.telepon}</td>
                      <td className="px-4 py-2" style={{ color: fontColor, fontWeight: 400 }}>{patient.status}</td>
                      <td className="px-4 py-2">
                        <button
                          className="px-3 py-1 border rounded transition"
                          style={{ borderColor: mainGreen, color: mainGreen }}
                        >
                          Aksi
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded transition font-semibold"
              style={{ backgroundColor: mainGreen, color: "#fff" }}
            >
              Lanjut
            </motion.button>
          </div>
        </main>
      </div>
    </div>
  );
}
