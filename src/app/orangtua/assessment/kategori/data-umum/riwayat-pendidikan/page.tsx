"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import dataPendidikan from "@/data/riwayat-pendidikan.json";

export default function RiwayatPendidikanAnak() {
  const router = useRouter();
  const pathname = usePathname();

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  const questions = dataPendidikan.riwayat_pendidikan;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Stepper Klikable */}
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

                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bagian Riwayat Pendidikan */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-5xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#36315B]">
                V. Riwayat Pendidikan Anak
              </h2>
            </div>

            <form className="space-y-8">
              {questions.map((q: any, idx: number) => (
                <div key={idx}>
                  <label className="block text-gray-700 mb-2 font-medium">
                    {q.question}
                  </label>

                  {/* Pilihan Radio */}
                  {q.type === "radio" && (
                    <div className="flex space-x-6">
                      {q.options.map((opt: string, i: number) => (
                        <label
                          key={i}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="radio"
                            name={`radio-${idx}`}
                            value={opt}
                            className="text-[#6BB1A0] focus:ring-[#6BB1A0]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Input Text */}
                  {q.type === "text" && (
                    <input
                      type="text"
                      placeholder="Tulis di sini..."
                      className="border border-gray-300 rounded-md p-2 w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
                    />
                  )}

                  {/* Textarea */}
                  {q.type === "textarea" && (
                    <textarea
                      rows={3}
                      placeholder="Tulis jawaban di sini..."
                      className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-8 py-2 rounded-xl font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
