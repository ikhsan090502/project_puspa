"use client";

import React, { useState, useEffect } from "react";
import { FaTh } from "react-icons/fa";

interface BackendDetailAnak {
  child_name: string;
  child_birth_info: string;
  child_age: string;
  child_gender: string;
  child_religion?: string;
  child_school?: string;
  child_address?: string;

  father_identity_number?: string;
  father_name?: string;
  father_birth_date?: string;
  father_occupation?: string;
  father_phone?: string;
  father_relationship?: string;

  mother_identity_number?: string;
  mother_name?: string;
  mother_birth_date?: string;
  mother_occupation?: string;
  mother_phone?: string;
  mother_relationship?: string;

  guardian_identity_number?: string | null;
  guardian_name?: string;
  guardian_birth_date?: string;
  guardian_occupation?: string;
  guardian_phone?: string;
  guardian_relationship?: string;

  child_complaint?: string;
  child_service_choice?: string;
}

const toISODate = (value?: string) => {
  if (!value || value === "-") return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const normalizeDate = (v: string) => (v ? v : null);

const parseBirthInfo = (str: string) => {
  if (!str) return { place: "", date: "" };
  const [place, date] = str.split(", ");
  return { place: place || "", date: date || "" };
};

const formatTanggalIndo = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  const bulan = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
};

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
    father_birth_date: "",
    father_occupation: "",
    father_phone: "",
    father_relationship: "",
    father_identity_number: "",

    mother_name: "",
    mother_birth_date: "",
    mother_occupation: "",
    mother_phone: "",
    mother_relationship: "",
    mother_identity_number: "",

    guardian_name: "",
    guardian_birth_date: "",
    guardian_occupation: "",
    guardian_phone: "",
    guardian_relationship: "",
    guardian_identity_number: "",
  });

  
  useEffect(() => {
    if (initialData) {
      const parsed = parseBirthInfo(initialData.child_birth_info || "");

      setFormData({
        ...formData,
        child_name: initialData.child_name || "",
        birth_place: parsed.place,
        birth_date: toISODate(parsed.date),
        child_age: initialData.child_age || "",
        child_religion: initialData.child_religion || "",
        child_gender: initialData.child_gender || "",
        child_school: initialData.child_school || "",
        child_address: initialData.child_address || "",
        child_complaint: initialData.child_complaint || "",
        child_service_choice: initialData.child_service_choice || "",

        father_name: initialData.father_name || "",
        father_birth_date: toISODate(initialData.father_birth_date),
        father_occupation: initialData.father_occupation || "",
        father_phone: initialData.father_phone || "",
        father_relationship: initialData.father_relationship || "",
         father_identity_number: initialData.father_identity_number || "",

        mother_name: initialData.mother_name || "",
      mother_birth_date: toISODate(initialData.mother_birth_date),
        mother_occupation: initialData.mother_occupation || "",
        mother_phone: initialData.mother_phone || "",
        mother_relationship: initialData.mother_relationship || "",
        mother_identity_number: initialData.mother_identity_number || "",


        guardian_name: initialData.guardian_name || "",
        guardian_birth_date: toISODate(initialData.guardian_birth_date),
        guardian_occupation: initialData.guardian_occupation || "",
        guardian_phone: initialData.guardian_phone || "",
        guardian_relationship: initialData.guardian_relationship || "",
         guardian_identity_number: initialData.guardian_identity_number || "",
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
     father_birth_date: normalizeDate(formData.father_birth_date),
      father_occupation: formData.father_occupation,
      father_phone: formData.father_phone,
      father_relationship: formData.father_relationship,
      father_identity_number: formData.father_identity_number,

      mother_name: formData.mother_name,
      mother_birth_date: normalizeDate(formData.mother_birth_date),
      mother_occupation: formData.mother_occupation,
      mother_phone: formData.mother_phone,
      mother_relationship: formData.mother_relationship,
      mother_identity_number: formData.mother_identity_number,

      guardian_name: formData.guardian_name,
      guardian_birth_date: normalizeDate(formData.guardian_birth_date),
      guardian_occupation: formData.guardian_occupation,
      guardian_phone: formData.guardian_phone,
      guardian_relationship: formData.guardian_relationship,
      guardian_identity_number: formData.guardian_identity_number,
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

  <label className="block text-sm mb-1">Nama Ayah</label>
  <input
    name="father_name"
    value={formData.father_name}
    onChange={handleChange}
    className="w-full border rounded-lg p-2 mb-3"
  />

  <label className="block text-sm mb-1">Hubungan</label>
  <input
    readOnly
    value="Ayah"
    className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
  />

<div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm mb-1">Tanggal Lahir</label>
      <input
        name="father_birth_date"
        value={formData.father_birth_date}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>

   <div>
      <label className="block text-sm mb-1">Pekerjaan</label>
      <input
        name="father_occupation"
        value={formData.father_occupation}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mt-3">
    <div>
      <label className="block text-sm mb-1">Nomor Telepon</label>
      <input
        name="father_phone"
        value={formData.father_phone}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>

    <div>
      <label className="block text-sm mb-1">NIK</label>
      <input
        name="father_identity_number"
        value={formData.father_identity_number}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  </div>
</div>


           <div className="border rounded-lg p-4 mb-4">
  <h4 className="font-semibold mb-2">Ibu</h4>

  <label className="block text-sm mb-1">Nama Ibu</label>
  <input
    name="mother_name"
    value={formData.mother_name}
    onChange={handleChange}
    className="w-full border rounded-lg p-2 mb-3"
  />

  <label className="block text-sm mb-1">Hubungan</label>
  <input
    readOnly
    value="Ibu"
    className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
  />

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm mb-1">Tanggal Lahir</label>
      <input
        name="mother_birth_date"
        value={formData.mother_birth_date}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>

    <div>
      <label className="block text-sm mb-1">Pekerjaan</label>
      <input
        name="mother_occupation"
        value={formData.mother_occupation}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mt-3">
    <div>
      <label className="block text-sm mb-1">Nomor Telepon</label>
      <input
        name="mother_phone"
        value={formData.mother_phone}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>

    <div>
      <label className="block text-sm mb-1">NIK</label>
      <input
        name="mother_identity_number"
        value={formData.mother_identity_number}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  </div>
</div>


            <div className="border rounded-lg p-4">
  <h4 className="font-semibold mb-2">Wali (Opsional)</h4>

  <label className="block text-sm mb-1">Nama Wali</label>
 <input
  type="date"
  name="guardian_birth_date"
  value={formData.guardian_birth_date}
  onChange={handleChange}
  className="w-full border rounded-lg p-2"
/>


  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm mb-1">Hubungan</label>
      <input
        name="guardian_relationship"
        value={formData.guardian_relationship}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>

    <div>
      <label className="block text-sm mb-1">Tanggal Lahir</label>
      <input
        name="guardian_birth_date"
        value={formData.guardian_birth_date}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mt-3">
    <div>
      <label className="block text-sm mb-1">Nomor Telepon</label>
      <input
        name="guardian_phone"
        value={formData.guardian_phone}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>

    <div>
      <label className="block text-sm mb-1">NIK</label>
      <input
        name="guardian_identity_number"
        value={formData.guardian_identity_number}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
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
  <div className="w-full p-2 border rounded-md bg-gray-100 text-gray-700">
    {formData.child_service_choice || "-"}
  </div>
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