"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function DataFisioterapiPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<"keluhan" | "riwayat">("keluhan");

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarOrangtua />

      {/* Main Frame */}
      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Step Progress */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center cursor-pointer"
                  onClick={() => router.push(step.path)}
                >
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

                  {/* Garis di antara lingkaran */}
                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card utama */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Section Title */}
            <h3 className="text-lg font-semibold mb-4">II. Data Fisioterapi</h3>

            {/* Tab Button */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("keluhan")}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium mr-2 ${
                  activeTab === "keluhan"
                    ? "bg-[#EAF4F1] text-[#357960] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Keluhan
              </button>
              <button
                onClick={() => setActiveTab("riwayat")}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                  activeTab === "riwayat"
                    ? "bg-[#EAF4F1] text-[#357960] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Riwayat Penyakit
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "keluhan" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Keluhan utama yang dialami anak saat ini :
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:outline-none focus:ring-2 focus:ring-[#6CC3AD]"
                    placeholder="Tuliskan keluhan anak di sini..."
                  ></textarea>
                </div>
              )}

              {activeTab === "riwayat" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Riwayat / perjalanan penyakit anak?
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:outline-none focus:ring-2 focus:ring-[#6CC3AD]"
                    placeholder="Tuliskan riwayat penyakit anak di sini..."
                  ></textarea>
                </div>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-end mt-8">
              {activeTab === "keluhan" ? (
                <button
                  onClick={() => setActiveTab("riwayat")}
                  className="px-6 py-2 bg-[#6CC3AD] text-white rounded-lg hover:bg-[#5bb49b]"
                >
                  Lanjutkan
                </button>
              ) : (
                <button className="px-6 py-2 bg-[#6CC3AD] text-white rounded-lg hover:bg-[#5bb49b]">
                  Simpan
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
