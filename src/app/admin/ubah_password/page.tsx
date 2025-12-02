"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function UbahPassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-10">
          {/* Title */}
          <h1 className="text-center text-3xl font-semibold text-[#2D2A55] mb-10">
            Ubah Password
          </h1>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-3xl mx-auto">

            {/* Header Row */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-[#2D2A55]">
                Perbarui Password
              </h2>

              <button
                className="px-5 py-1.5 text-sm rounded-lg border border-[#8BC3B8] text-[#4C8F82] hover:bg-[#8BC3B810]"
              >
                Perbarui
              </button>
            </div>

            {/* FORM */}

            {/* Password Saat Ini */}
            <div className="mb-6">
              <label className="block mb-2 text-[#2D2A55] font-medium">
                Password saat ini
              </label>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">
                  <Lock size={18} />
                </span>

                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-12 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC3B8]"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div className="mb-6">
              <label className="block mb-2 text-[#2D2A55] font-medium">
                Password baru
              </label>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">
                  <Lock size={18} />
                </span>

                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  className="w-full pl-10 pr-12 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC3B8]"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="mb-10">
              <label className="block mb-2 text-[#2D2A55] font-medium">
                Konfirmasi password
              </label>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">
                  <Lock size={18} />
                </span>

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Konfirmasi password"
                  className="w-full pl-10 pr-12 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC3B8]"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button Simpan */}
            <div className="flex justify-end mt-6">
              <button className="bg-[#8BC3B8] text-white px-8 py-2 rounded-xl hover:bg-[#76aea3] shadow">
                Simpan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
