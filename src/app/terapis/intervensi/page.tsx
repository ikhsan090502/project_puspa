"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkAuth } from "@/lib/checkAuth";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

export default function IntervensiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validate() {
      try {
        console.log("🔍 Memeriksa autentikasi Intervensi...");

        const auth = await checkAuth();
        console.log("✅ Auth result (Intervensi):", auth);

        if (!auth.success || (auth.role !== "terapis" && auth.role !== "asesor")) {
          console.warn("🚫 Tidak diizinkan, redirect ke login");
          router.replace("/auth/login");
        } else {
          console.log("🎉 Terapis terverifikasi, tampilkan intervensi");
          setLoading(false);
        }
      } catch (e) {
        console.error("🔥 Error saat validasi:", e);
        router.replace("/auth/login");
      }
    }

    validate();
  }, [router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memeriksa autentikasi...
    </div>
  );

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Intervensi</h2>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-600">Halaman Intervensi - Dalam pengembangan</p>
          </div>
        </main>
      </div>
    </div>
  );
}