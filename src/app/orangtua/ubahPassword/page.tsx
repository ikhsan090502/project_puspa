"use client";

import { useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/lib/api/profile";

export default function PasswordOrangtuaPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      alert("Semua field harus diisi.");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);
      const res = await updatePassword({
        current_password: oldPass,
        password: newPass,
        password_confirmation: confirmPass,
      });

      if (res?.success) {
        alert("Password berhasil diubah!");
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        alert(res?.message || "Gagal mengubah password");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-md">
      <div className="bg-white rounded-xl p-6 shadow-md mt-4">
        <h2 className="text-xl font-semibold text-[#4A8B73] text-center">
          Ubah Password
        </h2>

        <div className="mt-6 space-y-4">
          {/* PASSWORD SAAT INI */}
          <div>
            <label className="text-sm font-semibold">Password Saat Ini</label>
            <div className="relative mt-1">
              <input
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
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
          </div>

          {/* PASSWORD BARU */}
          <div>
            <label className="text-sm font-semibold">Password Baru</label>
            <div className="relative mt-1">
              <input
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
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
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div>
            <label className="text-sm font-semibold">Konfirmasi Password</label>
            <div className="relative mt-1">
              <input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
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
          </div>

          {/* BUTTON */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
            <a
              href="/orangtua/profil"
              className="px-4 py-2 rounded bg-gray-300 w-full sm:w-auto text-center"
            >
              Kembali
            </a>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#8EC3AA] text-white disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
