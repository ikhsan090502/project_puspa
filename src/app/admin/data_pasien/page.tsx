"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Search, Eye } from "lucide-react";

import FormUbahPasien from "@/components/form/FormUbahPasien";
import FormDetailPasien from "@/components/form/FormDetailPasien";
import FormHapusPasien from "@/components/form/FormHapusAdmin";

import {
  getAllPasien,
  getDetailPasien,
  updatePasien,
  deletePasien,
  PasienListItem,
  PasienDetail,
} from "@/lib/api/data_pasien";

export default function DataPasienPage() {
  const [search, setSearch] = useState("");
  const [pasienList, setPasienList] = useState<PasienListItem[]>([]);
  const [selectedPasien, setSelectedPasien] = useState<PasienDetail | null>(null);

  const [showUbah, setShowUbah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showHapus, setShowHapus] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      setLoading(true);
      const data = await getAllPasien();
      setPasienList(data || []);
    } catch (err) {
      console.error("Gagal memuat data pasien:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = pasienList.filter((p) =>
    (p.child_name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ================= DETAIL =================
  const handleDetail = async (childId: string) => {
    try {
      setLoading(true);
      const data = await getDetailPasien(childId);
      setSelectedPasien(data);
      setShowDetail(true);
    } catch (err) {
      alert("Gagal mengambil detail pasien");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUbah = async (data: Partial<PasienDetail>) => {
    if (!selectedPasien) return;

    try {
      await updatePasien(selectedPasien.child_id, data);

      // Refresh table
      const refreshed = await getAllPasien();
      setPasienList(refreshed);

      setShowUbah(false);
      setSelectedPasien(null);
    } catch (err) {
      alert("Gagal memperbarui data pasien");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    try {
      await deletePasien(id);
      alert("Data anak berhasil dihapus");

      setShowHapus(false);
      setDeleteId(null);

      await fetchPasien();
    } catch (error) {
      console.error("Gagal hapus anak:", error);
      alert("Gagal menghapus data anak");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Search */}
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari nama anak..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#ADADAD] rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4">
            {loading ? (
              <p className="text-center text-gray-500">Memuat data...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-500">Tidak ada data pasien</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#81B7A9] text-[#36315B]">
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Nama Anak</th>
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
                      key={pasien.child_id}
                      className="border-b border-[#81B7A9] hover:bg-gray-50"
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{pasien.child_name}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_birth_date}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_age}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_gender ?? "-"}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_school ?? "-"}</td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => handleDetail(pasien.child_id)}
                          className="hover:scale-110 transition text-[#36315B]"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={async () => {
                            setLoading(true);
                            const data = await getDetailPasien(pasien.child_id);
                            setSelectedPasien(data);
                            setShowUbah(true);
                            setLoading(false);
                          }}
                          className="hover:scale-110 transition text-[#4AB58E]"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(pasien.child_id);
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
            )}
          </div>
        </main>
      </div>

      {/* FORM MODALS */}
      <FormUbahPasien
        open={showUbah}
        onClose={() => setShowUbah(false)}
        onUpdate={handleUbah}
        initialData={selectedPasien ?? undefined}
      />

      <FormHapusPasien
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />

      <FormDetailPasien
        open={showDetail}
        onClose={() => setShowDetail(false)}
        pasien={selectedPasien ?? undefined}
      />
    </div>
  );
}
