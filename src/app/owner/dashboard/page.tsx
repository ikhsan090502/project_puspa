"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkAuth } from "@/lib/checkAuth";
import SidebarOwner from "@/components/layout/sidebar_owner";
import HeaderOwner from "@/components/layout/header_owner";

interface StatsCard {
  title: string;
  value: string;
  description: string;
  color: string;
}

const statsCards: StatsCard[] = [
  {
    title: "Total Admin",
    value: "12",
    description: "Admin terdaftar",
    color: "bg-blue-500",
  },
  {
    title: "Total Terapis",
    value: "25",
    description: "Terapis aktif",
    color: "bg-green-500",
  },
  {
    title: "Admin Unverified",
    value: "3",
    description: "Menunggu verifikasi",
    color: "bg-yellow-500",
  },
  {
    title: "Terapis Unverified",
    value: "5",
    description: "Menunggu verifikasi",
    color: "bg-red-500",
  },
];

export default function OwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
          console.log("🎉 Owner terverifikasi, tampilkan dashboard");
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
      <SidebarOwner />

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderOwner />

        <main className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
            <p className="text-gray-600">Pantau aktivitas dan verifikasi pengguna</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                    <p className="text-3xl font-bold text-[#36315B] mt-2">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {card.value.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/owner/verifikasi-admin")}
                className="bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Verifikasi Admin
              </button>
              <button
                onClick={() => router.push("/owner/verifikasi-terapis")}
                className="bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Verifikasi Terapis
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}