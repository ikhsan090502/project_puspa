"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CardInfo from "@/components/dashboard/card_info";
import JadwalTable from "@/components/dashboard/jadwal_table";
import PasienChart from "@/components/dashboard/pasien_chart";
import FormTambahAdmin from "@/components/form/FormTambahAdmin";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openTambahAdmin, setOpenTambahAdmin] = useState(false);

  useEffect(() => {
    async function validate() {
      console.log("🔍 Validating token on dashboard...");

      const auth = await checkAuth();
      console.log("✅ Auth check result:", auth);

      if (!auth.success || auth.role !== "admin") {
        console.warn("🚫 Unauthorized, redirecting...");
        router.replace("/auth/login");
      } else {
        console.log("🟢 Authorized as admin");
        setLoading(false);
      }
    }

    validate();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        Memeriksa autentikasi...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <CardInfo />
            </div>

            <div className="flex flex-col gap-4 text-[#36315B]">
              <button
                onClick={() => setOpenTambahAdmin(true)}
                className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full"
              >
                + Tambah Admin
              </button>

              <button
                disabled
                className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full"
              >
                + Tambah Terapis
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <JadwalTable />
            <PasienChart />
          </div>
        </div>
      </main>

      <FormTambahAdmin
        open={openTambahAdmin}
        onClose={() => setOpenTambahAdmin(false)}
        onSave={(data) => {
          console.log("Admin ditambahkan:", data);
          setOpenTambahAdmin(false);
        }}
      />
    </div>
  );
}
