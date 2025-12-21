"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const params = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [children, setChildren] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [selectedChild, setSelectedChild] = useState<ChildDetail | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  /* ================= LOAD DATA ================= */
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

  async function handleOpenDetail(id: string) {
    const data = await getChildDetail(id);
    setSelectedChild(data);
    setOpenDetail(true);
  }

  async function handleOpenEdit(id: string) {
    const data = await getChildDetail(id);
    setSelectedChild({ ...data, child_id: id });
    setOpenEdit(true);
  }

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleHapus = async (id: string) => {
    await deleteChild(id);
    const refreshed = await getChildren();
    setChildren(refreshed.data || []);
    setOpenDelete(false);
  };

  const handleUbah = async (payload: Partial<ChildDetail>) => {
    if (!selectedChild?.child_id) return;
    await updateChild(selectedChild.child_id, payload);
    const refreshed = await getChildren();
    setChildren(refreshed.data || []);
    setOpenEdit(false);
  };

  async function handleTambah() {
    await createChild(formAdd);
    const refreshed = await getChildren();
    setChildren(refreshed.data || []);
    setOpenAdd(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-20
          w-64 bg-white shadow-md
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarOrangtua />
      </aside>

      {/* overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* hamburger (mobile only) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-md shadow"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* ================= CONTENT ================= */}
<div className="flex-1 flex flex-col">
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
                    <button onClick={() => handleOpenDetail(child.child_id)}>
                      <FaEye />
                    </button>
                    <button onClick={() => handleOpenEdit(child.child_id)}>
                      <FaPen />
                    </button>
                    <button onClick={() => handleOpenDelete(child.child_id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setOpenAdd(true)}
                className="border-dashed border-2 border-gray-300 rounded-lg w-60 h-32 flex items-center justify-center text-gray-500 bg-white"
              >
                + Tambah Anak
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS (UNCHANGED) ================= */}
      <FormDetailPasien
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        pasien={selectedChild}
      />

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

      {/* ================= TAMBAH ANAK ================= */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg mx-4 p-6 rounded-lg max-h-[90vh] overflow-y-auto">
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
                  <label className="text-sm font-medium">{item.label}</label>
                  <input
                    name={item.name}
                    value={(formAdd as any)[item.name]}
                    onChange={handleAddChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              ))}

              <select
                name="child_gender"
                value={formAdd.child_gender}
                onChange={handleAddChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>

              <input
                type="date"
                name="child_birth_date"
                value={formAdd.child_birth_date}
                onChange={handleAddChange}
                className="w-full border rounded-lg px-3 py-2"
              />
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
