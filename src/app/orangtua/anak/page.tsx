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

  // Inisialisasi formAdd
const [formAdd, setFormAdd] = useState({
  child_name: "",
  child_gender: "",
  child_birth_place: "",
  child_birth_date: "",
  child_school: "",
  child_address: "",
  child_complaint: "",
  child_service_choice: [] as string[], // array
});

const handleAddChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  // Jika checkbox layanan
  if (
    name === "child_service_choice" &&
    e.target instanceof HTMLInputElement &&
    e.target.type === "checkbox"
  ) {
    const checked = e.target.checked;
    setFormAdd((prev) => {
      let newArray = [...prev.child_service_choice];
      if (checked) {
        newArray.push(value);
      } else {
        newArray = newArray.filter((v) => v !== value);
      }
      return { ...prev, child_service_choice: newArray };
    });
  } else {
    // input / textarea biasa
    setFormAdd((prev) => ({ ...prev, [name]: value }));
  }
};

// Saat submit, konversi array menjadi string agar sesuai tipe API


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
  const payload = {
    ...formAdd,
    child_service_choice: formAdd.child_service_choice.join(", "), // gabungkan array jadi string
  };
  await createChild(payload);
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

       <div className="p-6 text-[#36315B]">

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

                 <div className="flex justify-end gap-3 mt-2">
  <button
    onClick={() => handleOpenDetail(child.child_id)}
    className="text-[#36315B] hover:text-[#36315B]"
  >
    <FaEye size={16} />
  </button>

  <button
    onClick={() => handleOpenEdit(child.child_id)}
    className="text-[#36315B] hover:text-[#36315B]"
  >
    <FaPen size={16} />
  </button>

  <button
    onClick={() => handleOpenDelete(child.child_id)}
    className="text-red-500 hover:text-red-700"
  >
    <FaTrash size={16} />
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
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white w-full max-w-2xl mx-4 rounded-xl p-6 text-[#36315B] max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">Tambah Data Anak</h2>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="text-sm font-medium">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            name="child_name"
            value={formAdd.child_name}
            onChange={handleAddChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Tempat & Tanggal Lahir */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              Tempat Lahir <span className="text-red-500">*</span>
            </label>
            <input
              name="child_birth_place"
              value={formAdd.child_birth_place}
              onChange={handleAddChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Tanggal Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="child_birth_date"
              value={formAdd.child_birth_date}
              onChange={handleAddChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="text-sm font-medium">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="child_gender"
                value="laki-laki"
                checked={formAdd.child_gender === "laki-laki"}
                onChange={handleAddChange}
                className="accent-[#409E86] "
              />
              Laki - laki
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="child_gender"
                value="perempuan"
                checked={formAdd.child_gender === "perempuan"}
                onChange={handleAddChange}
                className="accent-[#409E86] "
              />
              Perempuan
            </label>
          </div>
        </div>

        {/* Sekolah */}
        <div>
          <label className="text-sm font-medium">Sekolah</label>
          <input
            name="child_school"
            value={formAdd.child_school}
            onChange={handleAddChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="text-sm font-medium">
            Alamat <span className="text-red-500">*</span>
          </label>
          <textarea
            name="child_address"
            value={formAdd.child_address}
            onChange={handleAddChange}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Keluhan */}
        <div>
          <label className="text-sm font-medium">
            Keluhan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="child_complaint"
            value={formAdd.child_complaint}
            onChange={handleAddChange}
            rows={3}
            placeholder="Isi Keluhan"
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Pilih Layanan */}
        <div>
          <label className="text-sm font-medium">
            Pilih Layanan <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
  {[
    "Asesmen Tumbuh Kembang",
    "Asesmen Terpadu",
    "Konsultasi Dokter",
    "Konsultasi Psikolog",
    "Konsultasi Keluarga",
    "Test Psikolog",
    "Layanan Minat Bakat",
    "Daycare",
    "Home Care",
    "Hydrotherapy",
    "Baby Spa",
    "Lainnya",
  ].map((item) => (
    <label key={item} className="flex items-center gap-2">
      <input
        type="checkbox"
        value={item}
        onChange={handleAddChange}
        name="child_service_choice"
        checked={formAdd.child_service_choice.includes(item)}
        className="accent-[#409E86] "
      />
      {item}
    </label>
  ))}
</div>

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
                className="px-4 py-2 bg-[#409E86] text-white rounded-lg"
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
