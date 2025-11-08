"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkAuth } from "@/lib/checkAuth";
import SidebarOwner from "@/components/layout/sidebar_owner";
import HeaderOwner from "@/components/layout/header_owner";
import { Settings, Save, Key } from "lucide-react";

export default function PengaturanOwnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function validate() {
      try {
        console.log("🔍 Memeriksa autentikasi Owner...");

        const auth = await checkAuth();
        console.log("✅ Auth result (Owner):", auth);

        if (!auth.success || auth.role !== "owner") {
          console.warn("🚫 Tidak diizinkan, redirect ke login");
          router.replace("/auth/login");
        } else {
          console.log("🎉 Owner terverifikasi, tampilkan pengaturan");
          setLoading(false);
        }
      } catch (e) {
        console.error("🔥 Error saat validasi:", e);
        router.replace("/auth/login");
      }
    }

    validate();
  }, [router]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // This would save settings to the backend
      console.log("Saving owner settings...");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Pengaturan berhasil disimpan!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memeriksa autentikasi...
    </div>
  );

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarOwner />

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderOwner />

        <main className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Pengaturan</h2>
            <p className="text-gray-600">Kelola pengaturan akun dan sistem</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-[#81B7A9] mr-3" />
                <h3 className="text-lg font-semibold">Pengaturan Profil</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    defaultValue="Owner Puspa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="owner@puspa.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Key className="w-6 h-6 text-[#81B7A9] mr-3" />
                <h3 className="text-lg font-semibold">Pengaturan Keamanan</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  />
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-[#81B7A9] mr-3" />
                <h3 className="text-lg font-semibold">Pengaturan Sistem</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifikasi Email</h4>
                    <p className="text-sm text-gray-600">Kirim notifikasi ke email untuk aktivitas penting</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81B7A9]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81B7A9]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-verifikasi</h4>
                    <p className="text-sm text-gray-600">Otomatis verifikasi admin baru</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81B7A9]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81B7A9]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold px-6 py-3 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}