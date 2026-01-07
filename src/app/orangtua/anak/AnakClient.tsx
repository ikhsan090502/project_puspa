"use client";

import React, { useEffect, useState } from "react";
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

type AddChildForm = {
  child_name: string;
  child_gender: string;
  child_birth_place: string;
  child_birth_date: string;
  child_school: string;
  child_address: string;
  child_complaint: string;
  child_service_choice: string[];
};

const SERVICE_CHOICES = [
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
] as const;

/**
 * ✅ Ambil tipe initialData langsung dari FormUbahPasien,
 * jadi tidak perlu menebak "BackendDetailAnak" strukturnya.
 */
type FormUbahProps = React.ComponentProps<typeof FormUbahPasien>;
type InitialDataType = FormUbahProps["initialData"];

/**
 * ✅ Konversi null -> undefined (deep) khusus untuk initialData,
 * agar cocok dengan tipe FormUbahPasien.
 */
function nullToUndefinedDeep<T>(value: T): T {
  if (value === null) return undefined as unknown as T;

  if (Array.isArray(value)) {
    return value.map((v) => nullToUndefinedDeep(v)) as unknown as T;
  }

  if (typeof value === "object" && value !== undefined) {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj)) {
      out[k] = nullToUndefinedDeep(obj[k]);
    }
    return out as unknown as T;
  }

  return value;
}

function toInitialData(child: ChildDetail | null): InitialDataType {
  if (!child) return undefined;
  // ubah null->undefined agar cocok dengan FormUbahPasien
  return nullToUndefinedDeep(child) as unknown as InitialDataType;
}

export default function ChildList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [children, setChildren] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [selectedChild, setSelectedChild] = useState<ChildDetail | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyAddForm: AddChildForm = {
    child_name: "",
    child_gender: "",
    child_birth_place: "",
    child_birth_date: "",
    child_school: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: [],
  };

  const [formAdd, setFormAdd] = useState<AddChildForm>(emptyAddForm);

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name } = target;

    // ✅ FIX TS2339: pastikan ini benar-benar HTMLInputElement checkbox
    if (
      name === "child_service_choice" &&
      target instanceof HTMLInputElement &&
      target.type === "checkbox"
    ) {
      const { value, checked } = target;

      setFormAdd((prev) => {
        const next = new Set(prev.child_service_choice);
        checked ? next.add(value) : next.delete(value);
        return { ...prev, child_service_choice: Array.from(next) };
      });
      return;
    }

    // input / textarea biasa
    setFormAdd((prev) => ({ ...prev, [name]: target.value }));
  };

  const loadChildren = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await getChildren();
      setChildren(res?.data || []);
    } catch (err) {
      console.error("❌ getChildren error:", err);
      setChildren([]);
      setErrorMsg("Gagal memuat data anak. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const handleOpenDetail = async (id: string) => {
    try {
      const data = await getChildDetail(id);
      setSelectedChild(data);
      setOpenDetail(true);
    } catch (err) {
      console.error("❌ getChildDetail error:", err);
      alert("Gagal membuka detail anak.");
    }
  };

  const handleOpenEdit = async (id: string) => {
    try {
      const data = await getChildDetail(id);
      setSelectedChild({ ...data, child_id: id });
      setOpenEdit(true);
    } catch (err) {
      console.error("❌ getChildDetail (edit) error:", err);
      alert("Gagal membuka form edit anak.");
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleHapus = async (id: string) => {
    try {
      await deleteChild(id);
      setOpenDelete(false);
      setDeleteId(null);
      await loadChildren();
    } catch (err) {
      console.error("❌ deleteChild error:", err);
      alert("Gagal menghapus data anak.");
    }
  };

  const handleUbah = async (payload: Partial<ChildDetail>) => {
    if (!selectedChild?.child_id) return;

    try {
      await updateChild(selectedChild.child_id, payload);
      setOpenEdit(false);
      setSelectedChild(null);
      await loadChildren();
    } catch (err) {
      console.error("❌ updateChild error:", err);
      alert("Gagal menyimpan perubahan.");
    }
  };

  const handleTambah = async () => {
    if (
      !formAdd.child_name ||
      !formAdd.child_birth_place ||
      !formAdd.child_birth_date ||
      !formAdd.child_gender ||
      !formAdd.child_address ||
      !formAdd.child_complaint ||
      formAdd.child_service_choice.length === 0
    ) {
      alert("Mohon lengkapi field wajib (*) dan pilih minimal 1 layanan.");
      return;
    }

    try {
      const payload = {
        ...formAdd,
        child_service_choice: formAdd.child_service_choice.join(", "),
      };

      await createChild(payload);

      setOpenAdd(false);
      setFormAdd(emptyAddForm);
      await loadChildren();
    } catch (err) {
      console.error("❌ createChild error:", err);
      alert("Gagal menambah data anak.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-md shadow"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        <HeaderOrangtua />

        <div className="p-6 text-[#36315B]">
          <h1 className="text-xl font-semibold mb-4">Data Anak</h1>

          {loading ? (
            <p className="text-gray-600">Memuat data...</p>
          ) : errorMsg ? (
            <div className="bg-white border rounded-lg p-4 text-red-600">
              {errorMsg}
            </div>
          ) : children.length === 0 ? (
            <div className="bg-white border rounded-lg p-4 text-gray-600">
              Belum ada data anak.
            </div>
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
                        {child.child_birth_info || "-"}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {child.child_gender || "-"}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </div>

                  <div className="flex justify-end gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(child.child_id)}
                      className="text-[#36315B]"
                      aria-label="Lihat"
                      title="Lihat"
                    >
                      <FaEye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(child.child_id)}
                      className="text-[#36315B]"
                      aria-label="Ubah"
                      title="Ubah"
                    >
                      <FaPen size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(child.child_id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Hapus"
                      title="Hapus"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setOpenAdd(true)}
                className="border-dashed border-2 border-gray-300 rounded-lg w-60 h-32 flex items-center justify-center text-gray-500 bg-white"
              >
                + Tambah Anak
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <FormDetailPasien
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        pasien={selectedChild}
      />

      <FormUbahPasien
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedChild(null);
        }}
        initialData={toInitialData(selectedChild)}
        onUpdate={handleUbah}
      />

      <FormHapusAnak
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setDeleteId(null);
        }}
        childId={deleteId ?? undefined}
        onConfirm={(id) => handleHapus(id)}
      />

      {/* TAMBAH ANAK */}
      {openAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-xl p-6 text-[#36315B] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">Tambah Data Anak</h2>

            <div className="space-y-4">
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
                      className="accent-[#409E86]"
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
                      className="accent-[#409E86]"
                    />
                    Perempuan
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Sekolah</label>
                <input
                  name="child_school"
                  value={formAdd.child_school}
                  onChange={handleAddChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

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

              <div>
                <label className="text-sm font-medium">
                  Pilih Layanan <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                  {SERVICE_CHOICES.map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={item}
                        onChange={handleAddChange}
                        name="child_service_choice"
                        checked={formAdd.child_service_choice.includes(item)}
                        className="accent-[#409E86]"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setOpenAdd(false);
                  setFormAdd(emptyAddForm);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
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
