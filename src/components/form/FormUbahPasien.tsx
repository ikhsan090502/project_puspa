
"use client";

import React, { useState, useEffect } from "react";

type FormFields = {
  nama: string;
  agama: string;
  tanggal_lahir: string;
  usia?: string;
  jenis_kelamin: string;
  alamat: string;
  asal_sekolah: string;
  keluhan: string;
  layanan_terpilih: string;

  // Tambahan field orangtua/wali
  ayah_nama?: string;
  ayah_usia?: string;
  ayah_pekerjaan?: string;
  ayah_telepon?: string;

  ibu_nama?: string;
  ibu_usia?: string;
  ibu_pekerjaan?: string;
  ibu_telepon?: string;

  wali_nama?: string;
  wali_hubungan?: string;
  wali_usia?: string;
  wali_pekerjaan?: string;
  wali_telepon?: string;
};

interface FormUbahPasienProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Partial<FormFields>) => void;
  initialData?: Partial<FormFields>;
}

export default function FormUbahPasien({
  open,
  onClose,
  onUpdate,
  initialData,
}: FormUbahPasienProps) {
  const [formData, setFormData] = useState<FormFields>({
    nama: "",
    agama: "",
    tanggal_lahir: "",
    usia: "",
    jenis_kelamin: "",
    alamat: "",
    asal_sekolah: "",
    keluhan: "",
    layanan_terpilih: "",
  });

  const hitungUsia = (tanggalLahir: string): string => {
    if (!tanggalLahir) return "";

    const lahir = new Date(tanggalLahir);
    const sekarang = new Date();

    let tahun = sekarang.getFullYear() - lahir.getFullYear();
    let bulan = sekarang.getMonth() - lahir.getMonth();

    if (bulan < 0) {
      tahun--;
      bulan += 12;
    }

    return `${tahun} Tahun ${bulan} Bulan`;
  };

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        usia: hitungUsia(initialData.tanggal_lahir ?? prev.tanggal_lahir),
      }));
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "tanggal_lahir") {
      setFormData((prev) => ({
        ...prev,
        tanggal_lahir: value,
        usia: hitungUsia(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-[#36315B]">
          Ubah Data Pasien
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama & Agama */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#36315B] mb-1">
                Nama
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#36315B] mb-1">
                Agama
              </label>
              <input
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
            </div>
          </div>

          {/* Tanggal Lahir & Jenis Kelamin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#36315B] mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#36315B] mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
              >
                <option value="" disabled>
                  Pilih Jenis Kelamin
                </option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Usia & Asal Sekolah */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#36315B] mb-1">
                Usia
              </label>
              <input
                type="text"
                name="usia"
                value={formData.usia}
                readOnly
                className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#36315B] mb-1">
                Asal Sekolah
              </label>
              <input
                name="asal_sekolah"
                value={formData.asal_sekolah}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Alamat
            </label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
          </div>

          {/* Section Orangtua / Wali */}
          <div>
            <h3 className="font-medium text-[#36315B] mb-2">
              Informasi Orangtua / Wali
            </h3>
            {/* Ayah */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-[#36315B] mb-2">Ayah</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="ayah_nama"
                  placeholder="Nama Ayah"
                  value={formData.ayah_nama || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  value="Ayah"
                  readOnly
                  className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                />
                <input
                  type="text"
                  name="ayah_usia"
                  placeholder="Usia"
                  value={formData.ayah_usia || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="ayah_pekerjaan"
                  placeholder="Pekerjaan"
                  value={formData.ayah_pekerjaan || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="ayah_telepon"
                  placeholder="Nomor Telepon"
                  value={formData.ayah_telepon || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 col-span-2"
                />
              </div>
            </div>

            {/* Ibu */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-[#36315B] mb-2">Ibu</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="ibu_nama"
                  placeholder="Nama Ibu"
                  value={formData.ibu_nama || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  value="Ibu"
                  readOnly
                  className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
                />
                <input
                  type="text"
                  name="ibu_usia"
                  placeholder="Usia"
                  value={formData.ibu_usia || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="ibu_pekerjaan"
                  placeholder="Pekerjaan"
                  value={formData.ibu_pekerjaan || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="ibu_telepon"
                  placeholder="Nomor Telepon"
                  value={formData.ibu_telepon || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 col-span-2"
                />
              </div>
            </div>

            {/* Wali (Opsional) */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-[#36315B] mb-2">
                Wali <span className="text-sm font-normal text-gray-500">(Jika Ada)</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="wali_nama"
                  placeholder="Nama Wali"
                  value={formData.wali_nama || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="wali_hubungan"
                  placeholder="Hubungan"
                  value={formData.wali_hubungan || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="wali_usia"
                  placeholder="Usia"
                  value={formData.wali_usia || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="wali_pekerjaan"
                  placeholder="Pekerjaan"
                  value={formData.wali_pekerjaan || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="text"
                  name="wali_telepon"
                  placeholder="Nomor Telepon"
                  value={formData.wali_telepon || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 col-span-2"
                />
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#36315B] text-[#36315B] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white hover:bg-[#36315B]"
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
