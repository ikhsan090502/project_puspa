"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

import FormTambahAdmin from "@/components/admin/FormTambahAdmin";
import FormUbahAdmin from "@/components/admin/FormUbahAdmin";
import FormHapusAdmin from "@/components/admin/FormHapusAdmin";

interface Admin {
  id: number;
  nama: string;
  username: string;
  email: string;
  telepon: string;
  ditambahkan: string;
  diubah: string;
}

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, nama: "Alief Arifin Mahardiko", username: "admin.alief", email: "admin@puspa.com", telepon: "08123456789", ditambahkan: "11/9/2025", diubah: "01/10/2025" },
    { id: 2, nama: "Rendra Prasetya", username: "admin.rendra", email: "admin@puspa.com", telepon: "08123456789", ditambahkan: "11/9/2025", diubah: "01/10/2025" },
    { id: 3, nama: "Annisa Nur Qoriah", username: "admin.annisa", email: "admin@puspa.com", telepon: "08123456789", ditambahkan: "11/9/2025", diubah: "01/10/2025" },
    { id: 4, nama: "Zamzam Berlian", username: "admin.zamzam", email: "admin@puspa.com", telepon: "08123456789", ditambahkan: "11/9/2025", diubah: "01/10/2025" },
  ]);

  const [showTambah, setShowTambah] = useState(false);

  const [showUbah, setShowUbah] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [showHapus, setShowHapus] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleTambah = (data: { nama: string; username: string; email: string; telepon: string }) => {
    const newAdmin: Admin = {
      id: admins.length + 1,
      ...data,
      ditambahkan: new Date().toLocaleDateString("en-GB"),
      diubah: new Date().toLocaleDateString("en-GB"),
    };
    setAdmins([...admins, newAdmin]);
    setShowTambah(false);
  };

  const handleUbah = (data: { nama: string; username: string; email: string; telepon: string }) => {
    if (!selectedAdmin) return;
    setAdmins(admins.map((a) => (a.id === selectedAdmin.id ? { ...a, ...data, diubah: new Date().toLocaleDateString("en-GB") } : a)));
    setShowUbah(false);
    setSelectedAdmin(null);
  };

  const handleHapus = (id: number) => {
    setAdmins(admins.filter((a) => a.id !== id));
    setShowHapus(false);
    setDeleteId(null);
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

          <div className=" bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#81B7A9] text-gray-600">
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Nama Pengguna</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Telepon</th>
                  <th className="p-3 text-left">Ditambahkan</th>
                  <th className="p-3 text-left">Diubah</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((admin, i) => (
                  <tr key={admin.id} className="border-b border-[#81B7A9] hover:bg-gray-50">
                    <td className="p-3 text-[#36315B]">{i + 1}</td>
                    <td className="p-3 text-[#36315B]">{admin.nama}</td>
                    <td className="p-3 text-[#757575] font-medium">{admin.username}</td>
                    <td className="p-3 text-[#757575] font-medium">{admin.email}</td>
                    <td className="p-3 text-[#757575] font-medium">{admin.telepon}</td>
                    <td className="p-3 text-[#757575] font-medium">{admin.ditambahkan}</td>
                    <td className="p-3 text-[#757575] font-medium">{admin.diubah}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowUbah(true);
                        }}
                        className="text-[#4AB58E] hover:text-emerald-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(admin.id);
                          setShowHapus(true);
                        }}
                        className="text-red-600 hover:text-red-800"
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

      <FormTambahAdmin open={showTambah} onClose={() => setShowTambah(false)} onSave={handleTambah} />

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
    </div>
  );
}
