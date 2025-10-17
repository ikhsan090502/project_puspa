"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { ClipboardList, FileText, Users, Search as SearchIcon } from "lucide-react";
import DatePicker from "@/components/dashboard/datepicker";

interface Jadwal {
  id: number;
  nama: string;
  usia: string;
  jenisKelamin: string;
  sekolah: string;
  orangtua: string;
  telepon: string;
  tanggalObservasi?: string; 
}

export default function JadwalPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"menunggu" | "terjadwal">("menunggu");
  const [pageTab, setPageTab] = useState<"observasi" | "asesmen" | "terapi">("observasi");
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([
    {
      id: 1,
      nama: "Alief",
      usia: "8 Tahun 2 Bulan",
      jenisKelamin: "Laki-Laki",
      sekolah: "SD Sana sini",
      orangtua: "Ibu Sari",
      telepon: "08xxxxxxxxxx",
    },
    {
      id: 2,
      nama: "Rendra",
      usia: "10 Tahun 7 Bulan",
      jenisKelamin: "Perempuan",
      sekolah: "SD Kestalan",
      orangtua: "Ibu Eni",
      telepon: "08xxxxxxxxxx",
    },
    {
      id: 3,
      nama: "Zamzam",
      usia: "11 Tahun 4 Bulan",
      jenisKelamin: "Laki-Laki",
      sekolah: "SD Kestalan",
      orangtua: "Ibu Setyo",
      telepon: "08xxxxxxxxxx",
    },
    {
      id: 4,
      nama: "Anisa",
      usia: "3 Tahun 2 Bulan",
      jenisKelamin: "Perempuan",
      sekolah: "-",
      orangtua: "Bapak Aditya",
      telepon: "08xxxxxxxxxx",
    },
  ]);

  const [selectedPasien, setSelectedPasien] = useState<Jadwal | null>(null);

  const filtered = jadwalList.filter(
    (j) =>
      j.nama.toLowerCase().includes(search.toLowerCase()) ||
      j.sekolah.toLowerCase().includes(search.toLowerCase()) ||
      j.orangtua.toLowerCase().includes(search.toLowerCase())
  );

  const displayed = filtered.filter((j) =>
    tab === "menunggu" ? !j.tanggalObservasi : j.tanggalObservasi
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 space-y-6">
          <div className="flex justify-center gap-30 mt-2">
            {[
              { key: "observasi", label: "Observasi", icon: ClipboardList },
              { key: "asesmen", label: "Asesmen", icon: FileText },
              { key: "terapi", label: "Terapi", icon: Users },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setPageTab(item.key as "observasi" | "asesmen" | "terapi")}
                className={`flex items-center justify-center gap-2 min-w-[220px] px-6 py-2 rounded-full text-sm font-medium transition
                ${
                  pageTab === item.key
                    ? "bg-[#6D5BD0] text-white"
                    : "bg-[#81B7A9] text-white hover:bg-[#5f9d8f]"
                }`}
              >
                <item.icon size={18} />
                Jadwal {item.label}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-6">
              <button
                onClick={() => setTab("menunggu")}
                className={`relative pb-2 text-sm font-medium ${
                  tab === "menunggu"
                    ? "text-[#36315B] border-b-2 border-[#81B7A9] font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Menunggu
              </button>
              <button
                onClick={() => setTab("terjadwal")}
                className={`relative pb-2 text-sm font-medium ${
                  tab === "terjadwal"
                    ? "text-[#36315B] border-b-2 border-[#81B7A9] font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Terjadwal
              </button>
            </div>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#ADADAD] rounded-full pl-3 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
              <SearchIcon size={16} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[#36315B]">
                  <th className="p-3 text-left">Nama Pasien</th>
                  <th className="p-3 text-left">Usia</th>
                  <th className="p-3 text-left">Jenis Kelamin</th>
                  <th className="p-3 text-left">Sekolah</th>
                  <th className="p-3 text-left">Nama Orangtua</th>
                  <th className="p-3 text-left">Telepon</th>
                  <th className="p-3 text-left">Tanggal Observasi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((j) => (
                  <tr key={j.id} className="border-b border-gray-100">
                    <td className="p-3 text-[#36315B]">{j.nama}</td>
                    <td className="p-3 text-[#36315B]">{j.usia}</td>
                    <td className="p-3 text-[#36315B]">{j.jenisKelamin}</td>
                    <td className="p-3 text-[#36315B]">{j.sekolah}</td>
                    <td className="p-3 text-[#36315B]">{j.orangtua}</td>
                    <td className="p-3 text-[#36315B]">{j.telepon}</td>
                    <td className="p-3 text-[#36315B]">{j.tanggalObservasi || "-"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedPasien(j)}
                        className="px-4 py-1 text-sm rounded bg-[#81B7A9] hover:bg-[#36315B] text-white transition"
                      >
                        {tab === "menunggu" ? "Pilih Tanggal" : "Edit Tanggal"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {selectedPasien && (
        <DatePicker
          pasien={selectedPasien}
          initialDate={selectedPasien.tanggalObservasi}
          onClose={() => setSelectedPasien(null)}
          onSave={(date) => {
            setJadwalList((prev) =>
              prev.map((p) =>
                p.id === selectedPasien.id
                  ? { ...p, tanggalObservasi: date.toLocaleDateString("id-ID") }
                  : p
              )
            );
            setSelectedPasien(null); 
          }}
        />
      )}
    </div>
  );
}