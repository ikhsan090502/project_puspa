"use client";

import React, { useState, useEffect } from "react";

export interface PatientFormData {
  child_name: string;
  child_birth_info: string;
  child_birth_date: string;
  child_age: string;
  child_gender?: string | null;
  child_school: string;
  child_address: string;
  child_complaint?: string | null;
  child_service_choice?: string | null;

  father_identity_number?: string | null;
  father_name?: string | null;
  father_phone?: string | null;
  father_birth_date?: string | null;
  father_occupation?: string | null;
  father_relationship?: string | null;

  mother_identity_number?: string | null;
  mother_name?: string | null;
  mother_phone?: string | null;
  mother_birth_date?: string | null;
  mother_occupation?: string | null;
  mother_relationship?: string | null;

  guardian_identity_number?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  guardian_birth_date?: string | null;
  guardian_occupation?: string | null;
  guardian_relationship?: string | null;
}

interface FormUbahPatientProps {
  open: boolean;
  onClose: () => void;
  initialData?: PatientFormData;
  onUpdate: (data: PatientFormData) => void | Promise<void>;
}

export default function FormUbahPatient({
  open,
  onClose,
  initialData,
  onUpdate,
}: FormUbahPatientProps) {
  const [form, setForm] = useState<PatientFormData>(
    initialData || {
      child_name: "",
      child_birth_info: "",
      child_birth_date: "",
      child_age: "",
      child_gender: "",
      child_school: "",
      child_address: "",
      child_complaint: "",
      child_service_choice: "",
    }
  );

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold mb-4">Ubah Data Pasien</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contoh input nama anak */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama Anak</label>
            <input
              type="text"
              name="child_name"
              value={form.child_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="child_birth_date"
              value={form.child_birth_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Tambahkan input lain sesuai PatientFormData */}
          <div>
            <label className="block text-sm font-medium mb-1">Sekolah</label>
            <input
              type="text"
              name="child_school"
              value={form.child_school}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
