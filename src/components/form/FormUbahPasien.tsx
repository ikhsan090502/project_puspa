"use client";

import React, { useState, useEffect } from "react";

interface BackendDetailAnak {
  child_name: string;
  child_birth_info: string;
  child_age: string;
  child_gender: string;
  child_religion?: string;
  child_school?: string;
  child_address?: string;

  father_name?: string;
  father_age?: string;
  father_occupation?: string;
  father_phone?: string;
  father_relationship?: string;

  mother_name?: string;
  mother_age?: string;
  mother_occupation?: string;
  mother_phone?: string;
  mother_relationship?: string;

  guardian_name?: string;
  guardian_age?: string;
  guardian_occupation?: string;
  guardian_phone?: string;
  guardian_relationship?: string;

  child_complaint?: string;
  child_service_choice?: string;
}

interface FormProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  initialData?: BackendDetailAnak;
}

export default function FormUbahPasien({
  open,
  onClose,
  onUpdate,
  initialData,
}: FormProps) {
  const [formData, setFormData] = useState({
    child_name: "",
    birth_place: "",
    birth_date: "",
    child_age: "",
    child_religion: "",
    child_gender: "",
    child_school: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: "",

    father_name: "",
    father_age: "",
    father_occupation: "",
    father_phone: "",
    father_relationship: "",

    mother_name: "",
    mother_age: "",
    mother_occupation: "",
    mother_phone: "",
    mother_relationship: "",

    guardian_name: "",
    guardian_age: "",
    guardian_occupation: "",
    guardian_phone: "",
    guardian_relationship: "",
  });

  function parseBirthInfo(str: string) {
    if (!str) return { place: "", date: "" };
    const parts = str.split(", ");
    return {
      place: parts[0] || "",
      date: parts[1] || "",
    };
  }

  function convertToInputDate(tanggal: string) {
    try {
      const tanggalObj = new Date(tanggal);
      return tanggalObj.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  }

  function formatTanggalIndo(date: string) {
    const d = new Date(date);
    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  }

  useEffect(() => {
    if (initialData) {
      const parsed = parseBirthInfo(initialData.child_birth_info || "");

      setFormData({
        ...formData,
        child_name: initialData.child_name || "",
        birth_place: parsed.place,
        birth_date: convertToInputDate(parsed.date),
        child_age: initialData.child_age || "",
        child_religion: initialData.child_religion || "",
        child_gender: initialData.child_gender || "",
        child_school: initialData.child_school || "",
        child_address: initialData.child_address || "",
        child_complaint: initialData.child_complaint || "",
        child_service_choice: initialData.child_service_choice || "",

        father_name: initialData.father_name || "",
        father_age: initialData.father_age || "",
        father_occupation: initialData.father_occupation || "",
        father_phone: initialData.father_phone || "",
        father_relationship: initialData.father_relationship || "",

        mother_name: initialData.mother_name || "",
        mother_age: initialData.mother_age || "",
        mother_occupation: initialData.mother_occupation || "",
        mother_phone: initialData.mother_phone || "",
        mother_relationship: initialData.mother_relationship || "",

        guardian_name: initialData.guardian_name || "",
        guardian_age: initialData.guardian_age || "",
        guardian_occupation: initialData.guardian_occupation || "",
        guardian_phone: initialData.guardian_phone || "",
        guardian_relationship: initialData.guardian_relationship || "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const payload = {
      child_name: formData.child_name,
      child_birth_info: `${formData.birth_place}, ${formatTanggalIndo(
        formData.birth_date
      )}`,
      child_gender: formData.child_gender,
      child_religion: formData.child_religion,
      child_school: formData.child_school,
      child_address: formData.child_address,
      child_complaint: formData.child_complaint,
      child_service_choice: formData.child_service_choice,

      father_name: formData.father_name,
      father_age: formData.father_age,
      father_occupation: formData.father_occupation,
      father_phone: formData.father_phone,
      father_relationship: formData.father_relationship,

      mother_name: formData.mother_name,
      mother_age: formData.mother_age,
      mother_occupation: formData.mother_occupation,
      mother_phone: formData.mother_phone,
      mother_relationship: formData.mother_relationship,

      guardian_name: formData.guardian_name,
      guardian_age: formData.guardian_age,
      guardian_occupation: formData.guardian_occupation,
      guardian_phone: formData.guardian_phone,
      guardian_relationship: formData.guardian_relationship,
    };

    onUpdate(payload);
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-[#36315B]">
          Ubah Data Pasien
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input
                type="text"
                name="child_name"
                value={formData.child_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Agama</label>
              <input
                name="child_religion"
                value={formData.child_religion}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Tanggal Lahir</label>
              <input
                type="birth_date"
                name="tanggal_lahir"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Jenis Kelamin</label>
              <select
                name="child_gender"
                value={formData.child_gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Usia</label>
              <input
                type="text"
                value={formData.child_age}
                readOnly
                className="w-full border rounded-lg p-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Asal Sekolah</label>
              <input
                name="child_school"
                value={formData.child_school}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Alamat</label>
            <input
              type="text"
              name="child_address"
              value={formData.child_address}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Informasi Orangtua / Wali</h3>

            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Ayah</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="father_name"
                  placeholder="Nama Ayah"
                  value={formData.father_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  readOnly
                  value="Ayah"
                  className="w-full border rounded-lg p-2 bg-gray-100"
                />
                <input
                  name="father_age"
                  placeholder="Usia"
                  value={formData.father_age}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="father_occupation"
                  placeholder="Pekerjaan"
                  value={formData.father_occupation}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="father_phone"
                  placeholder="Nomor Telepon"
                  value={formData.father_phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 col-span-2"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Ibu</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="mother_name"
                  placeholder="Nama Ibu"
                  value={formData.mother_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  readOnly
                  value="Ibu"
                  className="w-full border rounded-lg p-2 bg-gray-100"
                />
                <input
                  name="mother_age"
                  placeholder="Usia"
                  value={formData.mother_age}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="mother_occupation"
                  placeholder="Pekerjaan"
                  value={formData.mother_occupation}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="mother_phone"
                  placeholder="Nomor Telepon"
                  value={formData.mother_phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 col-span-2"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                Wali (Opsional)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="wali_nama"
                  placeholder="Nama Wali"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="wali_hubungan"
                  placeholder="Hubungan"
                  value={formData.guardian_relationship}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="wali_usia"
                  placeholder="Usia"
                  value={formData.guardian_age}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="wali_pekerjaan"
                  placeholder="Pekerjaan"
                  value={formData.guardian_occupation}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  name="wali_telepon"
                  placeholder="Nomor Telepon"
                  value={formData.guardian_phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 col-span-2"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Keluhan</label>
            <textarea
              name="keluhan"
              rows={3}
              value={formData.child_complaint}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Layanan Terpilih</label>
            <select
              name="layanan_terpilih"
              value={formData.child_service_choice}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Pilih layanan</option>
              <option value="Terapi Wicara">Terapi Wicara</option>
              <option value="Terapi Okupasi">Terapi Okupasi</option>
              <option value="Terapi Perilaku">Terapi Perilaku</option>
              <option value="Terapi Sensori Integrasi">Terapi Sensori Integrasi</option>
              <option value="Asesmen Awal">Asesmen Awal</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white"
            >
              Perbarui
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
