"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

interface Anak {
  nama: string;
  usia: string; 
  sekolah: string;
  keluhan: string;
  orangtua: string;
  telp: string;
  tglObservasi: string;
}

interface Kategori {
  title: string;
  filter: (d: Anak) => boolean;
}

const data: Anak[] = [
  {
    nama: "AKU",
    usia: "2 Tahun 5 Bulan",
    sekolah: "-",
    keluhan: "Sulit Bicara",
    orangtua: "Ibu Sari",
    telp: "081299999999",
    tglObservasi: "11/09/2025",
  },
  {
    nama: "Nama",
    usia: "5 Tahun 11 Bulan",
    sekolah: "TK B",
    keluhan: "Susah Fokus",
    orangtua: "Ayah Dedi",
    telp: "081299999999",
    tglObservasi: "23/09/2025",
  },
  {
    nama: "Nama",
    usia: "3 Tahun 0 Bulan",
    sekolah: "TK A",
    keluhan: "Jalan belum lancar",
    orangtua: "Wali Lina",
    telp: "081299999999",
    tglObservasi: "01/10/2025",
  },
];


const getTahun = (usia: string): number => {
  const parts = usia.split(" ");
  return parseInt(parts[0], 10) || 0;
};

const kategori: Kategori[] = [
  { title: "Usia 0-5 tahun", filter: (d) => getTahun(d.usia) <= 5 },
  {
    title: "Usia 6-12 tahun",
    filter: (d) => getTahun(d.usia) >= 6 && getTahun(d.usia) <= 12,
  },
  {
    title: "Usia 13-17 tahun",
    filter: (d) => getTahun(d.usia) >= 13 && getTahun(d.usia) <= 17,
  },
  { title: "Usia +17 tahun", filter: (d) => getTahun(d.usia) > 17 },
];

export default function ObservasiPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Anak | null>(null);

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
    
      <SidebarTerapis />

   
      <div className="flex flex-col flex-1 bg-gray-50">
      
        <HeaderTerapis />
        
        <main className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Pilih Anak Untuk Observasi</h2>


            <button
              onClick={() => router.push("/riwayat")}
              className="bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold px-4 py-2 rounded-lg"
            >
              Riwayat
            </button>
          </div>


          {kategori.map((kat, idx) => {
            const filtered = data.filter((d) => kat.filter(d));

            return (
              <div
                key={idx}
                className="mb-6 bg-white shadow-md rounded-lg p-4"
              >
                <h3 className="font-semibold mb-3">{kat.title}</h3>
                <table className="w-full text-sm table-auto border-collapse">
                  <thead>
                    <tr className="border-b border-[#81B7A9] bg-gray-100">
                      <th className="text-center py-3 px-4">Nama</th>
                      <th className="text-center py-3 px-4">Usia</th>
                      <th className="text-center py-3 px-4">Sekolah</th>
                      <th className="text-center py-3 px-4">Keluhan</th>
                      <th className="text-center py-3 px-4">Orangtua</th>
                      <th className="text-center py-3 px-4">Telepon</th>
                      <th className="text-center py-3 px-4">
                        Tanggal Observasi
                      </th>
                      <th className="text-center py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((d, i) => (
                        <tr
                          key={i}
                          className={`border-b border-[#81B7A9] hover:bg-gray-50 ${
                            selected === d ? "bg-[#81B7A940]" : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-center">{d.nama}</td>
                          <td className="py-3 px-4 text-center">{d.usia}</td>
                          <td className="py-3 px-4 text-center">
                            {d.sekolah}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {d.keluhan}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {d.orangtua}
                          </td>
                          <td className="py-3 px-4 text-center">{d.telp}</td>
                          <td className="py-3 px-4 text-center">
                            {d.tglObservasi}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button className="bg-[#81B7A9] hover:bg-[#36315B] text-white text-xs px-3 py-1 rounded">
                                Mulai
                              </button>
                              <button
                                className="p-1 text-[#81B7A9] hover:text-[#36315B]"
                                onClick={() => setSelected(d)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-3 px-4 text-gray-500 text-sm"
                        >
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}


          {selected && (
            <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
                <h3 className="text-xl font-bold mb-4">Detail Pasien</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Nama:</span>{" "}
                    {selected.nama}
                  </p>
                  <p>
                    <span className="font-semibold">Usia:</span>{" "}
                    {selected.usia}
                  </p>
                  <p>
                    <span className="font-semibold">Sekolah:</span>{" "}
                    {selected.sekolah}
                  </p>
                  <p>
                    <span className="font-semibold">Keluhan:</span>{" "}
                    {selected.keluhan}
                  </p>
                  <p>
                    <span className="font-semibold">Orangtua:</span>{" "}
                    {selected.orangtua}
                  </p>
                  <p>
                    <span className="font-semibold">Telepon:</span>{" "}
                    {selected.telp}
                  </p>
                  <p>
                    <span className="font-semibold">Tanggal Observasi:</span>{" "}
                    {selected.tglObservasi}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 bg-[#81B7A9] text-white rounded hover:bg-[#36315B]"
                    onClick={() => setSelected(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
