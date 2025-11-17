"use client";

import React, { useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function ProfileOrangtuaPage() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nama: "Malaikha",
    hubungan: "Ibu (Kandung)",
    tanggalLahir: "12-12-1981",
    telepon: "089714398009",
    email: "malaikha@gmail.com",
    pekerjaan: "Ibu Rumah Tangga",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        {/* Frame Profil */}
        <main className="flex-1 overflow-y-auto p-8 mt-0">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {!isEditing ? (
                // ====================== TAMPILAN PROFIL ======================
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Foto & Identitas */}
                  <div className="flex flex-col items-center text-center p-6 shadow rounded-xl bg-white">
                    <img
                      src="/profil.png"
                      className="w-44 h-44 rounded-full object-cover"
                    />
                    <h2 className="text-xl font-semibold text-[#4A8B73] mt-4">
                      {formData.nama}
                    </h2>
                    <p className="text-gray-500 text-sm">Orangtua Pasien/Anak</p>
                  </div>

                  {/* Informasi Profil */}
                  <div className="shadow rounded-xl p-6 bg-white relative">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute right-6 top-4 text-white bg-[#8EC3AA] px-4 py-1 rounded-full text-sm"
                    >
                      Edit
                    </button>

                    <div className="grid grid-cols-2 gap-y-3 text-sm mt-6">
                      <p className="font-semibold">Nama</p>
                      <p>{formData.nama}</p>

                      <p className="font-semibold">Hubungan</p>
                      <p>{formData.hubungan}</p>

                      <p className="font-semibold">Tanggal Lahir</p>
                      <p>{formData.tanggalLahir}</p>

                      <p className="font-semibold">Telepon</p>
                      <p>{formData.telepon}</p>

                      <p className="font-semibold">Email</p>
                      <p>{formData.email}</p>

                      <p className="font-semibold">User Role</p>
                      <p>Orangtua Pasien/Anak</p>

                      <p className="font-semibold">Pekerjaan</p>
                      <p>{formData.pekerjaan}</p>
                    </div>
                  </div>
                </div>
              ) : (
                // ====================== MODE EDIT PROFIL ======================
                <div className="shadow-lg rounded-xl p-6 bg-white">
                  <h2 className="text-xl font-semibold text-[#4A8B73] mb-4">
                    Informasi Pribadi
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 🌿 Kolom 1 — Foto */}
                    <div className="flex flex-col items-center shadow p-5 rounded-xl">
                      <img
                        src="/profil.png"
                        className="w-40 h-40 rounded-full object-cover"
                      />
                      <button className="mt-3 text-sm px-4 py-1 rounded-full bg-[#8EC3AA] text-white">
                        Ubah Profile
                      </button>
                    </div>

                    {/* 🌿 Kolom 2 — 3 Field */}
                    <div className="shadow rounded-xl p-5 space-y-4">
                      <div>
                        <label className="text-sm font-semibold">Nama</label>
                        <input
                          name="nama"
                          value={formData.nama}
                          onChange={handleChange}
                          className="border rounded px-3 py-1 w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">Hubungan</label>
                        <input
                          name="hubungan"
                          value={formData.hubungan}
                          onChange={handleChange}
                          className="border rounded px-3 py-1 w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">
                          Tanggal Lahir
                        </label>
                        <input
                          name="tanggalLahir"
                          value={formData.tanggalLahir}
                          onChange={handleChange}
                          className="border rounded px-3 py-1 w-full"
                        />
                      </div>
                    </div>

                    {/* 🌿 Kolom 3 — 3 Field berikutnya */}
                    <div className="shadow rounded-xl p-5 space-y-4">
                      <div>
                        <label className="text-sm font-semibold">Telepon</label>
                        <input
                          name="telepon"
                          value={formData.telepon}
                          onChange={handleChange}
                          className="border rounded px-3 py-1 w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">Pekerjaan</label>
                        <input
                          name="pekerjaan"
                          value={formData.pekerjaan}
                          onChange={handleChange}
                          className="border rounded px-3 py-1 w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">Email</label>
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="border rounded px-3 py-1 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tombol */}
                  <div className="flex justify-end mt-6 gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded bg-gray-300"
                    >
                      Batal
                    </button>
                    <button className="px-4 py-2 rounded bg-[#8EC3AA] text-white">
                      Perbarui
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
