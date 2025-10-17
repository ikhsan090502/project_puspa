"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";

import FormTambahAdmin from "@/components/form/FormTambahAdmin";
import FormUbahAdmin from "@/components/form/FormUbahAdmin";
import FormHapusAdmin from "@/components/form/FormHapusAdmin";
import {
  getAdmins,
  getAdminById,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  Admin,
} from "@/lib/api/data_admin";

function DetailAdmin({
  open,
  onClose,
  admin,
}: {
  open: boolean;
  onClose: () => void;
  admin: Admin | null;
}) {
  if (!open || !admin) return null;

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
          Detail Admin
        </h2>
        <hr className="border-t border-[#81B7A9] mb-3" />

        <p className="text-sm font-medium text-[#36315B]">Informasi Admin</p>
        <ul className="text-sm text-[#36315B] space-y-1 mt-2">
          <li>• Nama Lengkap : {admin.nama}</li>
          <li>• Nama Pengguna : {admin.username}</li>
          <li>• Email : {admin.email}</li>
          <li>• Telepon : {admin.telepon}</li>
          <li>• Tanggal Ditambahkan : {admin.ditambahkan}</li>
          <li>• Tanggal Diubah : {admin.diubah}</li>
        </ul>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showTambah, setShowTambah] = useState(false);
  const [showUbah, setShowUbah] = useState(false);
  const [showHapus, setShowHapus] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 🔹 Ambil daftar admin
  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🔹 Lihat detail admin
  const handleDetail = async (id: string) => {
    try {
      const item = await getAdminById(id);
      setSelectedAdmin(item);
      setShowDetail(true);
    } catch (error) {
      console.error("Gagal memuat detail admin:", error);
    }
  };

  // 🔹 Tambah admin
  const handleTambah = async (data: {
    nama: string;
    username: string;
    email: string;
    telepon: string;
    password?: string;
  }) => {
    try {
      await addAdmin(data);
      alert("Admin berhasil ditambahkan!");
      setShowTambah(false);
      fetchAdmins();
    } catch (error) {
      console.error("Gagal menambah admin:", error);
    }
  };

  // 🔹 Ubah admin
  const handleUbah = async (data: {
    nama: string;
    username: string;
    email: string;
    telepon: string;
  }) => {
    if (!selectedAdmin) return;
    try {
      await updateAdmin(selectedAdmin.id, data);
      setShowUbah(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (error) {
      console.error("Gagal mengubah admin:", error);
    }
  };

  // 🔹 Hapus admin
  const handleHapus = async (id: string) => {
    try {
      await deleteAdmin(id);
      setShowHapus(false);
      setDeleteId(null);
      fetchAdmins();
    } catch (error) {
      console.error("Gagal menghapus admin:", error);
    }
  };

  const filtered = admins.filter(
    (a) =>
      a.nama.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase())
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
              Tambah Admin
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

          <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#81B7A9] text-[#36315B]">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Nama Pengguna</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Telepon</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((admin, i) => (
                  <tr key={admin.id} className="border-b border-[#81B7A9] hover:bg-gray-50">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{admin.nama}</td>
                    <td className="p-3 font-medium text-[#757575]">{admin.username}</td>
                    <td className="p-3 font-medium text-[#757575]">{admin.email}</td>
                    <td className="p-3 font-medium text-[#757575]">{admin.telepon}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => handleDetail(admin.id)}
                        className="hover:scale-110 transition text-[#36315B]"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowUbah(true);
                        }}
                        className="hover:scale-110 transition text-[#4AB58E]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(admin.id);
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

      <FormTambahAdmin
        open={showTambah}
        onClose={() => setShowTambah(false)}
        onSave={handleTambah}
      />
      <FormUbahAdmin
        open={showUbah}
        onClose={() => setShowUbah(false)}
        onUpdate={handleUbah}
        initialData={selectedAdmin || undefined}
      />
      <FormHapusAdmin
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />
      <DetailAdmin
        open={showDetail}
        onClose={() => setShowDetail(false)}
        admin={selectedAdmin}
      />
    </div>
  );
}
