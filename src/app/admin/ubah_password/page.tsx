"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";

export default function UbahPasswordAdmin() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua field harus diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);

      // ✅ pastikan endpoint sesuai BE
      await api.put("/profile/update-password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("❌ update password error:", err);
      toast.error(err?.response?.data?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Toaster position="top-right" />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 flex items-start justify-center p-6">
          <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#2D2A55] text-center">
              Ubah Password
            </h2>

            <div className="mt-6 space-y-4">
              {/* Current */}
              <div>
                <label className="text-sm font-semibold">Password Saat Ini</label>
                <div className="relative mt-1">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border w-full px-3 py-2 rounded"
                    placeholder="Masukkan password saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-2.5 text-gray-500"
                    aria-label="Toggle password"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New */}
              <div>
                <label className="text-sm font-semibold">Password Baru</label>
                <div className="relative mt-1">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border w-full px-3 py-2 rounded"
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-2.5 text-gray-500"
                    aria-label="Toggle password"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="text-sm font-semibold">Konfirmasi Password</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border w-full px-3 py-2 rounded"
                    placeholder="Konfirmasi password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-2.5 text-gray-500"
                    aria-label="Toggle password"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-2 w-full px-4 py-2 rounded bg-[#8BC3B8] text-white disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
