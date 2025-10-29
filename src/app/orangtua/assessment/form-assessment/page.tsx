"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import FormAssessmentOrangTua from "@/components/FormAssessmentOrangTua";

export default function FormAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const selectedChildrenIds = searchParams.get("children")?.split(",") || [];

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch("/api/proxy/auth/protected", { credentials: "include" });
        const data = await res.json();

        if (!data?.success || data?.data?.role !== "orangtua") {
          router.replace("/auth/login");
        } else {
          setLoading(false);
        }
      } catch (e) {
        router.replace("/auth/login");
      }
    }

    if (selectedChildrenIds.length === 0) {
      router.replace("/orangtua/assessment");
      return;
    }

    validate();
  }, [router, selectedChildrenIds]);

  const handlePrev = () => {
    router.push(`/orangtua/assessment/riwayat-pendidikan?children=${selectedChildrenIds.join(",")}`);
  };

  const handleComplete = () => {
    // Navigate back to dashboard or show success message
    router.push("/orangtua/dashboard");
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memeriksa autentikasi...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />
      <div className="flex-1 flex flex-col">
        <HeaderOrangtua />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Form Assessment Orang Tua
            </h1>
            <button
              onClick={handlePrev}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
          </div>

          <FormAssessmentOrangTua
            selectedChildrenIds={selectedChildrenIds}
            onComplete={handleComplete}
          />
        </main>
      </div>
    </div>
  );
}