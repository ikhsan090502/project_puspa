"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

import {
  getChildren,
  getChildDetail,
  updateChild,
  deleteChild,
  createChild,
  ChildItem,
  ChildDetail,
} from "@/lib/api/childrenAsesment";

import FormDetailPasien from "@/components/form/FormDetailPasien";
import FormUbahPasien from "@/components/form/FormUbahPasien";
import FormHapusAnak from "@/components/form/FormHapusAnak";

import { FaEye, FaPen, FaTrash } from "react-icons/fa";

export default function ChildList() {
  const router = useRouter();
  const params = useParams(); // ← Ditambahkan

  // Jika halaman ini memakai dynamic segment /children/[child_id]
  const child_id_from_params = params?.child_id || null;

  const [children, setChildren] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [selectedChild, setSelectedChild] = useState<ChildDetail | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form tambah anak
  const [formAdd, setFormAdd] = useState({
    child_name: "",
    child_gender: "",
    child_birth_place: "",
    child_birth_date: "",
    child_school: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: "",
  });

  const handleAddChange = (e: any) => {
    setFormAdd({ ...formAdd, [e.target.name]: e.target.value });
  };

  // LOAD CHILD LIST
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getChildren();
        setChildren(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // DETAIL
  async function handleOpenDetail(id: string) {
    const data = await getChildDetail(id);
    setSelectedChild(data);
    setOpenDetail(true);
  }

  // EDIT
  async function handleOpenEdit(id: string) {
  const data = await getChildDetail(id);

  // pastikan child_id masuk ke state
  setSelectedChild({
    ...data,
    child_id: id,
  });

  setOpenEdit(true);
}
  // DELETE modal open
  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  // DELETE confirm
  const handleHapus = async (id: string) => {
  try {
    await deleteChild(id);

    const refreshed = await getChildren();
    setChildren(refreshed.data || []);

    setOpenDelete(false);
    setDeleteId(null);
  } catch (err) {
    console.error("Gagal hapus anak:", err);
  }
};

  // ==================================================
  //  UPDATE CHILD (REVISI – ID dipastikan aman)
  // ==================================================
  const handleUbah = async (payload: Partial<ChildDetail>) => {
  if (!selectedChild?.child_id) {
    console.error("❌ child_id tidak ditemukan saat update!");
    return;
  }

  try {
    const childId = selectedChild.child_id; // ⬅ FIX PENTING

    await updateChild(childId, payload);

    const refreshed = await getChildren();
    setChildren(refreshed.data || []);

    setOpenEdit(false);
    setSelectedChild(null);
  } catch (err) {
    console.error("❌ Gagal update data anak:", err);
  }
};

  // CREATE CHILD
  async function handleTambah() {
    try {
      await createChild(formAdd);

      const refreshed = await getChildren();
      setChildren(refreshed.data || []);

      setOpenAdd(false);

      setFormAdd({
        child_name: "",
        child_gender: "",
        child_birth_place: "",
        child_birth_date: "",
        child_school: "",
        child_address: "",
        child_complaint: "",
        child_service_choice: "",
      });
    } catch (err) {
      console.error("Gagal tambah anak:", err);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <div className="p-6">
          <h1 className="text-xl font-semibold mb-4">Data Anak</h1>

          {loading ? (
            <p className="text-gray-600">Memuat data...</p>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {children.map((child) => (
                <div
                  key={child.child_id}
                  className="border rounded-lg p-4 w-60 shadow-sm flex flex-col gap-2 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-green-200 text-green-800 rounded-full w-10 h-10 flex items-center justify-center">
                      👶
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold">{child.child_name}</h2>
                      <p className="text-sm text-gray-500">
                        {child.child_birth_info}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {child.child_gender}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() => handleOpenDetail(child.child_id)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleOpenEdit(child.child_id)}
                    >
                      <FaPen />
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleOpenDelete(child.child_id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              {/* Tambah Anak */}
              <button
                onClick={() => setOpenAdd(true)}
                className="border-dashed border-2 border-gray-300 rounded-lg w-60 h-32 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 bg-white"
              >
                + Tambah Anak
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL */}
      <FormDetailPasien
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        pasien={selectedChild}
      />

      {/* EDIT */}
      <FormUbahPasien
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={selectedChild || undefined}
        onUpdate={handleUbah}
      />

     <FormHapusAnak
  open={openDelete}
  onClose={() => setOpenDelete(false)}
  childId={deleteId ?? undefined}
  onConfirm={(id) => handleHapus(id)}
/>


      {/* TAMBAH ANAK */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Tambah Anak</h2>

            <div className="space-y-3">
              {[
                { name: "child_name", label: "Nama Anak" },
                { name: "child_birth_place", label: "Tempat Lahir" },
                { name: "child_school", label: "Sekolah" },
                { name: "child_address", label: "Alamat" },
                { name: "child_complaint", label: "Keluhan" },
                { name: "child_service_choice", label: "Pilihan Layanan" },
              ].map((item) => (
                <div key={item.name}>
                  <label className="font-medium">{item.label}</label>
                  <input
                    name={item.name}
                    value={(formAdd as any)[item.name]}
                    onChange={handleAddChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              ))}

              <div>
                <label className="font-medium">Jenis Kelamin</label>
                <select
                  name="child_gender"
                  value={formAdd.child_gender}
                  onChange={handleAddChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="font-medium">Tanggal Lahir</label>
                <input
                  type="date"
                  name="child_birth_date"
                  value={formAdd.child_birth_date}
                  onChange={handleAddChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenAdd(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleTambah}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
