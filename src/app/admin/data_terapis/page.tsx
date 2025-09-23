"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";

import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import FormUbahTerapis from "@/components/form/FormUbahTerapis";
import FormHapusTerapis from "@/components/form/FormHapusAdmin";

interface Terapis {
  id: number;
  nama: string;
  bidang: string;
  username: string;
  email: string;
  telepon: string;
  ditambahkan: string;
  diubah: string;
}

function DetailTerapis({
  open,
  onClose,
  terapis,
}: {
  open: boolean;
  onClose: () => void;
  terapis: Terapis | null;
}) {
  if (!open || !terapis) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-[#81B7A9]"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold text-[#36315B] mb-3">
          Detail Terapis
        </h2>
        <hr className="border-t border-[#81B7A9] mb-3" />

        <p className="text-sm font-medium text-[#36315B]">Informasi Terapis</p>
        <ul className="text-sm text-[#36315B] space-y-1 mt-2">
          <li>• Nama Lengkap : {terapis.nama}</li>
          <li>• Bidang : {terapis.bidang}</li>
          <li>• Nama Pengguna : {terapis.username}</li>
          <li>• Email : {terapis.email}</li>
          <li>• Telepon : {terapis.telepon}</li>
          <li>• Tanggal Ditambahkan : {terapis.ditambahkan}</li>
          <li>• Tanggal Diubah : {terapis.diubah}</li>
        </ul>
      </div>
    </div>
  );
}

export default function DataTerapisPage() {
  const [search, setSearch] = useState("");
  const [terapisList, setTerapisList] = useState<Terapis[]>([
    {
      id: 1,
      nama: "Alief Arifin Mahardiko",
      bidang: "Okupasi Terapi",
      username: "alief.okupasi",
      email: "terapis.puspa.com",
      telepon: "08123456789",
      ditambahkan: "11/9/2025",
      diubah: "01/10/2025",
    },
    {
      id: 2,
      nama: "Rendra Prasetya",
      bidang: "Paedagog",
      username: "rendra.paedagog",
      email:  "terapis.puspa.com",
      telepon: "08123456789",
      ditambahkan: "11/9/2025",
      diubah: "01/10/2025",
    },
    {
      id: 3,
      nama: "Annisa Nur Qoriah",
      bidang: "Fisioterapi",
      username: "annisa.fisioterapi",
      email:  "terapis.puspa.com",
      telepon: "08123456789",
      ditambahkan: "11/9/2025",
      diubah: "01/10/2025",
    },
  ]);

  const [showTambah, setShowTambah] = useState(false);
  const [showUbah, setShowUbah] = useState(false);
  const [selectedTerapis, setSelectedTerapis] = useState<Terapis | null>(null);

  const [showHapus, setShowHapus] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showDetail, setShowDetail] = useState(false);

  const handleTambah = (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  }) => {
    const newTerapis: Terapis = {
      id: terapisList.length + 1,
      ...data,
      ditambahkan: new Date().toLocaleDateString("en-GB"),
      diubah: new Date().toLocaleDateString("en-GB"),
    };
    setTerapisList([...terapisList, newTerapis]);
    setShowTambah(false);
  };

  const handleUbah = (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  }) => {
    if (!selectedTerapis) return;
    setTerapisList(
      terapisList.map((t) =>
        t.id === selectedTerapis.id
          ? { ...t, ...data, diubah: new Date().toLocaleDateString("en-GB") }
          : t
      )
    );
    setShowUbah(false);
    setSelectedTerapis(null);
  };

  const handleHapus = (id: number) => {
    setTerapisList(terapisList.filter((t) => t.id !== id));
    setShowHapus(false);
    setDeleteId(null);
  };

  const filtered = terapisList.filter(
    (t) =>
      t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.username.toLowerCase().includes(search.toLowerCase()) ||
      t.bidang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowTambah(true)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#81B7A9] hover:bg-[#36315B] text-white"
            >
              <Plus size={18} />
              Tambah Terapis
            </button>

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
                  <th className="p-3 text-left">Bidang</th>
                  <th className="p-3 text-left">Nama Pengguna</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Telepon</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((terapis, i) => (
                  <tr
                    key={terapis.id}
                    onClick={() => setSelectedTerapis(terapis)}
                    className={`border-b border-[#81B7A9] hover:bg-gray-50 cursor-pointer 
                      ${selectedTerapis?.id === terapis.id && (showDetail || showUbah)
                        ? "bg-[#C0DCD6] text-[#36315B]"
                        : ""}`}
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{terapis.nama}</td>
                    <td className="p-3 !text-[#757575]">{terapis.bidang}</td>
                    <td className="p-3 font-medium !text-[#757575]">{terapis.username}</td>
                    <td className="p-3 font-medium !text-[#757575]">{terapis.email}</td>
                    <td className="p-3 font-medium !text-[#757575]">{terapis.telepon}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTerapis(terapis);
                          setShowDetail(true);
                        }}
                        className="hover:scale-110 transition text-[#36315B]"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTerapis(terapis);
                          setShowUbah(true);
                        }}
                        className="hover:scale-110 transition text-[#4AB58E]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(terapis.id);
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

      <FormTambahTerapis
        open={showTambah}
        onClose={() => setShowTambah(false)}
        onSave={handleTambah}
      />
      <FormUbahTerapis
        open={showUbah}
        onClose={() => setShowUbah(false)}
        onUpdate={handleUbah}
        initialData={selectedTerapis || undefined}
      />
      <FormHapusTerapis
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />
      <DetailTerapis
        open={showDetail}
        onClose={() => setShowDetail(false)}
        terapis={selectedTerapis}
      />
    </div>
  );
}
