"use client";

import { useEffect, useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function DashboardOrangtua() {
  const [namaAnak, setNamaAnak] = useState("Ananda");
  const [progress, setProgress] = useState<number | null>(null);
  const [jadwal, setJadwal] = useState([
    { hari: "Senin", terapi: "Terapi Wicara", jam: "09:00 - 10:00" },
    { hari: "Rabu", terapi: "Terapi Okupasi", jam: "10:30 - 11:30" },
  ]);

  useEffect(() => {
    const anak = localStorage.getItem("namaAnak");
    if (anak) setNamaAnak(anak);
    setProgress(78); // contoh data sementara
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarOrangtua />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <HeaderOrangtua />

        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Selamat Datang, Bunda 👋
          </h1>
          <p className="text-gray-600">
            Berikut ringkasan perkembangan {namaAnak} hari ini.
          </p>

          {/* Ringkasan Sederhana */}
          <section className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Perkembangan Terbaru
            </h2>
            <p className="text-gray-700">
              Kemajuan terapi minggu ini:{" "}
              <span className="font-bold text-green-600">
                {progress ? `${progress}%` : "-"}
              </span>
            </p>
          </section>

          {/* Jadwal Terdekat */}
          <section className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Jadwal Terapi Terdekat
            </h2>
            <p className="text-gray-700">
              {jadwal[0].hari}, {jadwal[0].jam} — {jadwal[0].terapi}
            </p>
          </section>

          {/* Jadwal Mingguan */}
          <section className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Jadwal Terapi Minggu Ini
            </h2>
            <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left">Hari</th>
                  <th className="py-2 px-3 text-left">Jenis Terapi</th>
                  <th className="py-2 px-3 text-left">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-3">{item.hari}</td>
                    <td className="py-2 px-3">{item.terapi}</td>
                    <td className="py-2 px-3">{item.jam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
