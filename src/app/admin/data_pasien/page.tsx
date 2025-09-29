"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Search, Eye } from "lucide-react";

import FormUbahPasien from "@/components/form/FormUbahPasien";
import FormDetailPasien from "@/components/form/FormDetailPasien";
import FormHapusTerapis from "@/components/form/FormHapusAdmin";

interface Pendamping {
  nama: string;
  hubungan: "Ayah" | "Ibu" | "Wali";
  usia: string;
  pekerjaan: string;
  telepon: string;
}

interface Pasien {
  id: number;
  nama: string;
  agama: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  asal_sekolah: string;
  alamat: string;
  ditambahkan: string;
  diubah: string;
  pendamping: Pendamping[];
  keluhan?: string;
  layanan?: string[];
}

function hitungUsia(tanggalLahir: string): string {
  const lahir = new Date(tanggalLahir);
  const sekarang = new Date();

  let tahun = sekarang.getFullYear() - lahir.getFullYear();
  let bulan = sekarang.getMonth() - lahir.getMonth();

  if (bulan < 0) {
    tahun--;
    bulan += 12;
  }

  return `${tahun} Tahun ${bulan} Bulan`;
}

function formatTanggal(tanggal: string): string {
  if (!tanggal) return "-";
  const d = new Date(tanggal);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return d.toLocaleDateString("id-ID", options);
}

export default function DataPasienPage() {
  const [search, setSearch] = useState("");
  const [PasienList, setPasienList] = useState<Pasien[]>([
    {
      id: 1,
      nama: "Alief",
      agama: "Islam",
      tanggal_lahir: "2020-01-01",
      jenis_kelamin: "Laki-Laki",
      asal_sekolah: "TK Melati",
      alamat: "Solo",
      ditambahkan: "11/9/2025",
      diubah: "01/10/2025",
      pendamping: [
        {
          nama: "Siti",
          hubungan: "Wali",
          usia: "45 Tahun",
          pekerjaan: "Bibi",
          telepon: "0813-xxxx-xxxx",
        },
      ],
      keluhan: "Anak sering batuk dan pilek",
      layanan: ["Pemeriksaan Dokter Anak", "Terapi Wicara"],
    },
    {
      id: 2,
      nama: "Alif",
      agama: "Islam",
      tanggal_lahir: "2020-02-01",
      jenis_kelamin: "Laki-Laki",
      asal_sekolah: "TK Melati",
      alamat: "Solo",
      ditambahkan: "11/9/2025",
      diubah: "01/10/2025",
      pendamping: [
        {
          nama: "Budi",
          hubungan: "Ayah",
          usia: "38 Tahun",
          pekerjaan: "Petani",
          telepon: "0812-xxxx-2222",
        },
      ],
      keluhan: "Kesulitan berbicara dengan jelas",
      layanan: ["Terapi Wicara"],
    },
  ]);

  const [showUbah, setShowUbah] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);

  const [showHapus, setShowHapus] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showDetail, setShowDetail] = useState(false);

  // filtering pasien
  const filtered = PasienList.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleUbah = (data: Partial<Pasien>) => {
    if (!selectedPasien) return;
    setPasienList(
      PasienList.map((t) =>
        t.id === selectedPasien.id
          ? { ...t, ...data, diubah: new Date().toLocaleDateString("en-GB") }
          : t
      )
    );
    setShowUbah(false);
    setSelectedPasien(null);
  };

  const handleHapus = (id: number) => {
    setPasienList(PasienList.filter((t) => t.id !== id));
    setShowHapus(false);
    setDeleteId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#ADADAD] rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
            </div>
          </div>

          <div className=" bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#81B7A9] text-[#36315B]">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Tanggal Lahir</th>
                  <th className="p-3 text-left">Usia</th>
                  <th className="p-3 text-left">Jenis Kelamin</th>
                  <th className="p-3 text-left">Asal Sekolah</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pasien, i) => (
                  <tr
                    key={pasien.id}
                    onClick={() => setSelectedPasien(pasien)}
                    className={`border-b border-[#81B7A9] hover:bg-gray-50 cursor-pointer 
                      ${selectedPasien?.id === pasien.id && (showDetail || showUbah)
                        ? "bg-[#C0DCD6] text-[#36315B]"
                        : ""}`}
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{pasien.nama}</td>
                    <td className="p-3 !text-[#757575]">
                      {formatTanggal(pasien.tanggal_lahir)}
                    </td>
                    <td className="p-3 font-medium !text-[#757575]">
                      {hitungUsia(pasien.tanggal_lahir)}
                    </td>
                    <td className="p-3 font-medium !text-[#757575]">
                      {pasien.jenis_kelamin}
                    </td>
                    <td className="p-3 font-medium !text-[#757575]">
                      {pasien.asal_sekolah}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPasien(pasien);
                          setShowDetail(true);
                        }}
                        className="hover:scale-110 transition text-[#36315B]"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPasien(pasien);
                          setShowUbah(true);
                        }}
                        className="hover:scale-110 transition text-[#4AB58E]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(pasien.id);
                          setShowHapus(true);
                        }}
                        className="hover:scale-110 transition text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* gunakan nama komponen sesuai import */}
      <FormUbahPasien
        open={showUbah}
        onClose={() => setShowUbah(false)}
        onUpdate={handleUbah}
        initialData={selectedPasien || undefined}
      />
      <FormHapusTerapis
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />
      <FormDetailPasien
        open={showDetail}
        onClose={() => setShowDetail(false)}
        pasien={selectedPasien}
      />
    </div>
  );
}
