"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import dataRiwayat from "@/data/riwayat-anak.json";
import { ChevronDown, Plus, Trash } from "lucide-react";

export default function RiwayatJawabanAnak() {
  const router = useRouter();
  const pathname = usePathname();

  const categories = [
    { key: "riwayat_psikososial", label: "Riwayat Psikososial" },
    { key: "riwayat_kehamilan", label: "Riwayat Kehamilan" },
    { key: "riwayat_kelahiran", label: "Riwayat Kelahiran" },
    { key: "riwayat_setelah_kelahiran", label: "Riwayat Setelah Kelahiran" },
  ];

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const [activeCategory, setActiveCategory] = useState("riwayat_psikososial");

  const currentQuestions =
    dataRiwayat[activeCategory as keyof typeof dataRiwayat] || [];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  const [answers, setAnswers] = useState<any>({});

  const setAnswer = () => {}; // READ ONLY

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          {/* STEP NAVIGATION */}
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

          {/* CONTENT */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#36315B]">
                I. Data Umum
              </h2>

              {/* 🟢 DROPDOWN SUDAH BISA DIKLIK */}
              <div className="relative inline-block">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-[#36315B] cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* FORM */}
            <form className="space-y-6">
              {currentQuestions.map((q: any, idx: number) => (
                <div key={idx}>
                  <label className="block text-gray-700 mb-1 font-medium">
                    {q.question}
                  </label>

                  {/* TEXT */}
                  {q.type === "text" && (
                    <input
                      type="text"
                      readOnly
                      className="border border-gray-300 rounded-md p-2 w-full text-sm"
                      placeholder={q.placeholder || ""}
                    />
                  )}

                  {/* NUMBER */}
                  {q.type === "number" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        readOnly
                        className="border border-gray-300 rounded-md p-2 w-32 text-sm"
                      />
                      {q.suffix && <span>{q.suffix}</span>}
                    </div>
                  )}

                  {/* TEXTAREA */}
                  {q.type === "textarea" && (
                    <textarea
                      rows={3}
                      readOnly
                      className="border border-gray-300 rounded-md p-2 w-full text-sm"
                      placeholder={q.placeholder || ""}
                    ></textarea>
                  )}

                  {/* SELECT */}
                  {q.type === "select" && (
                    <select
                      disabled
                      className="border border-gray-300 rounded-md p-2 text-sm disabled:opacity-100 cursor-default"
                    >
                      <option>Pilih salah satu</option>
                      {q.options?.map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* RADIO */}
                  {q.type === "radio" && (
                    <div className="flex gap-6 mt-2 flex-wrap">
                      {q.options?.map((opt: string, i: number) => (
                        <label key={i} className="flex items-center gap-2">
                          <input type="radio" disabled className="cursor-default" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* RADIO WITH TEXT */}
                  {q.type === "radio_with_text" && (
                    <div className="space-y-3 mt-2">
                      <div className="flex gap-6 flex-wrap">
                        {q.options?.map((opt: string, i: number) => (
                          <label key={i} className="flex items-center gap-2">
                            <input type="radio" disabled className="cursor-default" />
                            {opt}
                          </label>
                        ))}
                      </div>

                      <input
                        type="text"
                        readOnly
                        className="border border-gray-300 rounded-md p-2 w-full text-sm"
                        placeholder="Keterangan"
                      />
                    </div>
                  )}

                  {/* CHECKBOX */}
                  {q.type === "checkbox" && (
                    <div className="flex gap-6 mt-2 flex-wrap">
                      {q.options?.map((opt: string, i: number) => (
                        <label key={i} className="flex items-center gap-2">
                          <input type="checkbox" disabled className="cursor-default" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* MULTI FIELD */}
                  {q.type === "multi" && (
                    <div className="space-y-3">
                      {[{ Nama: "", Usia: "" }].map((row: any, rowIndex: number) => (
                        <div key={rowIndex} className="flex items-center gap-4">
                          <input
                            type="text"
                            placeholder="Nama"
                            readOnly
                            className="border border-gray-300 p-2 rounded-md text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Usia"
                            readOnly
                            className="border border-gray-300 p-2 rounded-md text-sm w-24"
                          />
                          <button disabled className="text-[#6BB1A0] cursor-default opacity-100">
                            <Plus size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TABLE */}
                  {q.type === "table" && (
                    <div className="space-y-2">
                      {q.rows.map((row: string, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="w-48">{row}</span>

                          <input
                            type="number"
                            readOnly
                            className="border border-gray-300 rounded-md p-2 w-32 text-sm"
                            placeholder="Usia"
                          />
                          {q.suffix && <span>{q.suffix}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  disabled
                  className="bg-[#6BB1A0] text-white px-8 py-2 rounded-xl font-medium cursor-default opacity-100"
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
