"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { updateProfileWithPhoto } from "@/lib/api/ProfileTerapis";
import { useTherapistProfile } from "@/context/ProfileTerapisContext";

export default function ProfilePage() {
  const { profile, setProfile, refreshProfile } = useTherapistProfile();

  const [form, setForm] = useState({
    therapist_name: "",
    therapist_phone: "",
    email: "",
    date_of_birth: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // =====================================
  // LOAD PROFILE TO FORM
  // =====================================
  useEffect(() => {
    if (!profile) {
      setLoading(true);
      return;
    }

    setForm({
      therapist_name: profile.therapist_name ?? "",
      therapist_phone: profile.therapist_phone ?? "",
      email: profile.email ?? "",
      date_of_birth: profile.date_of_birth ?? "",
    });

    setPreviewUrl(profile.profile_picture || null);
    setLoading(false);
  }, [profile]);

  // =====================================
  // FORM INPUT
  // =====================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setUpdateSuccess(false);
    setUpdateError(null);
  };

  // =====================================
  // FOTO PROFIL
  // =====================================
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // =====================================
  // SUBMIT UPDATE
  // =====================================
  const handleSubmit = async () => {
  if (!profile?.therapist_id) {
    setUpdateError("ID terapis tidak ditemukan.");
    return;
  }

  setUpdating(true);
  setUpdateError(null);
  setUpdateSuccess(false);

  try {
    const payload: any = { ...form };

    if (selectedFile) {
      payload.profile_picture = selectedFile;
    }

    // 1. Update ke backend
    await updateProfileWithPhoto(profile.therapist_id, payload);

    // ❗ WAJIB → ambil ulang data paling baru
    await refreshProfile();

    setSelectedFile(null);
    setUpdateSuccess(true);
  } catch (err: any) {
    setUpdateError(err?.message || "Gagal memperbarui profil.");
  } finally {
    setUpdating(false);
  }
};


  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <p className="text-[#36315B] flex justify-center items-center min-h-screen">
        Loading...
      </p>
    );
  }

  // =====================================
  // UI
  // =====================================
  return (
    <div className="flex min-h-screen bg-gray-100 text-[#36315B]">
      <SidebarTerapis />

      <div className="flex-1">
        <HeaderTerapis />

        <main className="p-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Informasi Pribadi
          </h2>

          <div className="bg-white border border-green-200 rounded-lg p-10 w-full max-w-4xl flex gap-12">
            {/* FOTO PROFIL */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-32 h-32 relative rounded-full overflow-hidden border border-green-200">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Foto Profil"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Foto
                  </div>
                )}
              </div>

              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInput"
                className="mt-4 px-4 py-2 border border-green-200 rounded text-green-600 hover:bg-green-50 cursor-pointer"
              >
                Pilih Foto
              </label>
            </div>

            {/* FORM */}
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama</label>
                  <input
                    type="text"
                    name="therapist_name"
                    value={form.therapist_name}
                    onChange={handleChange}
                    className="block w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    className="block w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Telepon
                  </label>
                  <input
                    type="text"
                    name="therapist_phone"
                    value={form.therapist_phone}
                    onChange={handleChange}
                    className="block w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  disabled={updating}
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {updating ? "Memperbarui..." : "Perbarui"}
                </button>
              </div>
            </div>
          </div>

          {updateError && <p className="mt-4 text-red-600">{updateError}</p>}
          {updateSuccess && (
            <p className="mt-4 text-green-600">
              Profil berhasil diperbarui!
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
