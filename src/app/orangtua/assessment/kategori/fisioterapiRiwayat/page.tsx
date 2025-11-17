"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function DataFisioterapiPage() {
  const router = useRouter();
  const pathname = usePathname();

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" }
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  // Dummy Data Riwayat
  const dataRiwayat = {
    keluhan: "Sering mengeluhkan nyeri pada kaki kanan terutama setelah berjalan lama.",
    riwayat: "Riwayat kelahiran normal. Mulai berjalan pada usia 20 bulan. Sempat mengalami infeksi lutut." 
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Step Progress */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        i === activeStep ? "text-[#36315B]" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card utama read-only */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6">II. Data Fisioterapi (Riwayat Jawaban)</h3>

            <div className="space-y-6">
              {/* Keluhan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keluhan utama yang dialami anak saat ini:
                </label>
                <textarea
                  readOnly
                  value={dataRiwayat.keluhan}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700 min-h-[120px] resize-none"
                />
              </div>

              {/* Riwayat Penyakit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riwayat / perjalanan penyakit anak:
                </label>
                <textarea
                  readOnly
                  value={dataRiwayat.riwayat}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700 min-h-[120px] resize-none"
                />
              </div>
            </div>

            {/* Button Back */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
