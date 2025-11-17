"use client";

import { useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordOrangtuaPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        {/* Geser frame ke atas → hapus margin kosong */}
        <main className="flex-1 overflow-y-auto p-6">

          <div className="bg-white rounded-xl p-6 shadow-md max-w-xl mx-auto mt-4">
            <h2 className="text-xl font-semibold text-[#4A8B73] text-center">
              Ubah Password
            </h2>

            <div className="mt-6">

              {/* PASSWORD SAAT INI */}
              <label className="text-sm font-semibold">Password Saat Ini</label>
              <div className="relative mt-1">
                <input
                  type={showOld ? "text" : "password"}
                  className="border w-full px-3 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* PASSWORD BARU */}
              <label className="text-sm font-semibold mt-4 block">
                Password Baru
              </label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  className="border w-full px-3 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* KONFIRMASI PASSWORD */}
              <label className="text-sm font-semibold mt-4 block">
                Konfirmasi Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="border w-full px-3 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* BUTTON */}
              <div className="flex justify-between mt-6">
                <a
                  href="/orangtua/profil"
                  className="px-4 py-2 rounded bg-gray-300"
                >
                  Kembali
                </a>
                <button className="px-4 py-2 rounded bg-[#8EC3AA] text-white">
                  Simpan
                </button>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
