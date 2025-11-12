"use client";

import { useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import dataRiwayat from "@/data/riwayat-anak.json";
import { ChevronDown } from "lucide-react";

export default function FormAssessmentOrangtua() {
  const categories = [
    { key: "riwayat_psikososial", label: "Riwayat Psikososial" },
    { key: "riwayat_kehamilan", label: "Riwayat Kehamilan" },
    { key: "riwayat_kelahiran", label: "Riwayat Kelahiran" },
    { key: "riwayat_setelah_kelahiran", label: "Riwayat Setelah Kelahiran" },
  ];

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];

  const [activeCategory, setActiveCategory] = useState("riwayat_psikososial");

  const currentQuestions =
    dataRiwayat[activeCategory as keyof typeof dataRiwayat] || [];

  return (
     <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <SidebarOrangtua />
    
          {/* Main Content */}
          <div className="flex-1 flex flex-col ml-64">
            <HeaderOrangtua />
    
    
        <main className="flex-1 overflow-y-auto p-8">
          {/* Konten halaman di sini */}
        
          
   {/* Step Progress */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === 0
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        i === 0 ? "text-[#36315B]" : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>

                  {/* Garis antar lingkaran */}
                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Section Data Umum */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#36315B]">
                I. Data Umum
              </h2>

              {/* Dropdown Pilih Riwayat */}
              <div className="relative inline-block">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-[#36315B] focus:outline-none focus:ring-2 focus:ring-[#6BB1A0] cursor-pointer"
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

            {/* ✅ Render Pertanyaan Dinamis */}
            <form className="space-y-6">
              {currentQuestions.map((q: any, idx: number) => (
                <div key={idx}>
                  <label className="block text-gray-700 mb-1 font-medium">
                    {q.question}
                  </label>

                  {q.type === "text" && (
                    <input
                      type="text"
                      placeholder={q.placeholder || ""}
                      className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
                    />
                  )}

                  {q.type === "number" && (
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md p-2 w-32 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
                    />
                  )}

                  {q.type === "textarea" && (
                    <textarea
                      rows={3}
                      placeholder={q.placeholder || ""}
                      className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
                    ></textarea>
                  )}

                  {q.type === "radio" && (
                    <div className="flex gap-6 mt-2 flex-wrap">
                      {q.options?.map((opt: string, i: number) => (
                        <label key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`radio-${idx}`}
                            className="text-[#6BB1A0] focus:ring-[#6BB1A0]"
                          />
                          <span className="text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === "checkbox" && (
                    <div className="flex gap-6 mt-2 flex-wrap">
                      {q.options?.map((opt: string, i: number) => (
                        <label key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="text-[#6BB1A0] focus:ring-[#6BB1A0]"
                          />
                          <span className="text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === "select" && (
                    <select className="appearance-none border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]">
                      <option value="">Pilih...</option>
                      {q.options?.map((opt: string, i: number) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {q.type === "multi" && (
                    <div className="flex gap-4">
                      {q.fields?.map((field: string, i: number) => (
                        <input
                          key={i}
                          type="text"
                          placeholder={field}
                          className="border border-gray-300 rounded-md p-2 w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
                        />
                      ))}
                    </div>
                  )}

                  {q.type === "table" && (
                    <table className="border-collapse border w-full mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left text-sm">
                            Kemampuan
                          </th>
                          <th className="border p-2 text-center text-sm">
                            Usia (bulan)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {q.rows?.map((row: string, i: number) => (
                          <tr key={i}>
                            <td className="border p-2 text-sm">{row}</td>
                            <td className="border p-2 text-center">
                              <input
                                type="number"
                                className="border border-gray-300 rounded-md p-1 w-24 text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#6BB1A0]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}

              {/* Tombol Simpan */}
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
