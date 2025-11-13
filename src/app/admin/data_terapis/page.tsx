"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";

import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import FormUbahTerapis from "@/components/form/FormUbahTerapis";
import FormHapusTerapis from "@/components/form/FormHapusAdmin";

import {
  getTerapis,
  addTerapis,
  updateTerapis,
  deleteTerapis,
  getDetailTerapis,
  Terapis,
} from "@/lib/api/data_terapis";

// ================== DETAIL MODAL ==================
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
          <li>• Ditambahkan : {terapis.ditambahkan}</li>
          <li>• Diubah : {terapis.diubah}</li>
        </ul>
      </div>
    </div>
  );
}

// ================== MAIN PAGE ==================
export default function DataTerapisPage() {
  const [search, setSearch] = useState("");
  const [terapisList, setTerapisList] = useState<Terapis[]>([]);
  const [showTambah, setShowTambah] = useState(false);
  const [showUbah, setShowUbah] = useState(false);
  const [selectedTerapis, setSelectedTerapis] = useState<Terapis | null>(null);
  const [showHapus, setShowHapus] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // ================== FETCH DATA ==================
  useEffect(() => {
    fetchTerapis();
  }, []);

  const fetchTerapis = async () => {
    try {
      const data = await getTerapis();
      setTerapisList(data);
    } catch (err) {
      console.error("❌ Gagal mengambil data terapis:", err);
    }
  };

  // ================== TAMBAH ==================
  const handleTambah = async (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
    password: string;
  }) => {
    try {
      const res = await addTerapis(data);
      if (res.data.success) {
        alert("✅ Terapis berhasil ditambahkan!");
        setShowTambah(false);
        fetchTerapis(); // fetch ulang supaya tabel otomatis update
      } else {
        alert("❌ Gagal menambah terapis");
      }
    } catch (err: any) {
      console.error("❌ Gagal menambah terapis:", err.response?.data || err);
      alert("❌ Gagal menambah terapis");
    }
  };

  // ================== UBAH ==================
  const handleUbah = async (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  }) => {
    if (!selectedTerapis) return;
    try {
      const res = await updateTerapis(selectedTerapis.id, data);
      if (res.data.success) {
        alert("✅ Data terapis berhasil diperbarui!");
        setShowUbah(false);
        fetchTerapis(); // fetch ulang untuk update tabel
      } else {
        alert("❌ Gagal memperbarui data terapis");
      }
    } catch (err: any) {
      console.error("❌ Gagal memperbarui terapis:", err.response?.data || err);
      alert("❌ Gagal memperbarui data terapis");
    }
  };

  // ================== HAPUS ==================
  const handleHapus = async (id: string) => {
    try {
      const res = await deleteTerapis(id);
      if (res.data.success) {
        alert("🗑️ Terapis berhasil dihapus!");
        setShowHapus(false);
        fetchTerapis(); // fetch ulang untuk update tabel
      } else {
        alert("❌ Gagal menghapus terapis");
      }
    } catch (err: any) {
      console.error("❌ Gagal menghapus terapis:", err.response?.data || err);
      alert("❌ Gagal menghapus terapis");
    }
  };

  // ================== DETAIL ==================
  const handleDetail = async (id: string) => {
    try {
      const data = await getDetailTerapis(id);
      if (data) {
        setSelectedTerapis(data);
        setShowDetail(true);
      }
    } catch (err) {
      console.error("❌ Gagal menampilkan detail:", err);
      alert("❌ Gagal menampilkan detail terapis");
    }
  };

  // ================== FILTER ==================
  const filtered = terapisList.filter(
    (t) =>
      (t.nama?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.bidang?.toLowerCase() || "").includes(search.toLowerCase())
  );

  // ================== RENDER ==================
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header Table */}
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

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4">
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
                    className="border-b border-[#81B7A9] hover:bg-gray-50"
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{terapis.nama}</td>
                    <td className="p-3 text-[#757575]">{terapis.bidang}</td>
                    <td className="p-3 text-[#757575]">{terapis.username}</td>
                    <td className="p-3 text-[#757575]">{terapis.email}</td>
                    <td className="p-3 text-[#757575]">{terapis.telepon}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => handleDetail(terapis.id)}
                        className="hover:scale-110 transition text-[#36315B]"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTerapis(terapis);
                          setShowUbah(true);
                        }}
                        className="hover:scale-110 transition text-[#4AB58E]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
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

      {/* ================== MODALS ================== */}
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
