"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import dataWicara from "@/data/wicaraAssessment.json";

export default function TerapiWicaraPageReadOnly() {
  const router = useRouter();
  const pathname = usePathname();

  const category = (dataWicara as any).categories[0];
  const questions = category.questions;

  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem("wicara_answers_v1");
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  // === STEPPER CONFIG ===
  const steps = [
    { label: "Data Umum" },
    { label: "Data Fisioterapi" },
    { label: "Data Terapi Okupasi" },
    { label: "Data Terapi Wicara" },
    { label: "Data Paedagog" },
  ];

  // Step aktif: DATA TERAPI WICARA
  const activeStep = steps.findIndex(
    (step) =>
      step.label.toLowerCase().replace(/\s/g, "-") === "data-terapi-wicara"
  );

  const radioTextIDs = [5, 6, 7, 8];

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="p-8 flex-1 overflow-y-auto">
          {/* === STEPPER READ-ONLY === */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2">
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
                    <div className="w-10 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* === FORM WRAPPER === */}
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              {questions.map((q: any) => {
                const isRadioText = radioTextIDs.includes(q.id);

                return (
                  <div key={q.id} className="mb-6">
                    <label className="block font-medium mb-2">
                      {q.id}. {q.question}
                    </label>

                    {/* === TEXTAREA === */}
                    {q.type === "textarea" && !isRadioText && (
                      <textarea
                        className="w-full border rounded-lg p-3 h-24 bg-gray-100 text-gray-700"
                        value={answers[q.id] || ""}
                        readOnly
                        disabled
                      ></textarea>
                    )}

                    {/* === RADIO + FIELDS UNTUK 5–8 === */}
                    {isRadioText && (
                      <div className="space-y-3 mt-2">
                        {["Ya", "Tidak"].map((op: string) => (
                          <label key={op} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={"q" + q.id}
                              value={op}
                              checked={answers[q.id]?.status === op}
                              readOnly
                              disabled
                            />
                            {op}
                          </label>
                        ))}

                        {answers[q.id]?.status === "Ya" && (
                          <div className="grid gap-3 mt-2">
                            {(q.fields || ["Keterangan"]).map(
                              (f: string, idx: number) => (
                                <input
                                  key={idx}
                                  placeholder={f}
                                  value={answers[q.id]?.[f] || ""}
                                  className="border rounded-lg p-2 bg-gray-100 text-gray-700"
                                  readOnly
                                  disabled
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* === RADIO NORMAL === */}
                    {q.type === "radio" && !isRadioText && (
                      <div className="flex gap-6 mt-2">
                        {q.options.map((op: string) => (
                          <label key={op} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={"q" + q.id}
                              value={op}
                              checked={answers[q.id] === op}
                              readOnly
                              disabled
                            />
                            {op}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* === TABLE === */}
                    {q.type === "table" && (
                      <div className="space-y-3 mt-2">
                        {q.rows.map((row: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 border-b pb-2"
                          >
                            <span className="w-72">{row}</span>
                            <input
                              type="text"
                              placeholder="Usia (bulan/tahun)"
                              value={answers[q.id]?.[row] || ""}
                              className="border rounded-lg p-2 flex-1 bg-gray-100 text-gray-700"
                              readOnly
                              disabled
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="mt-8 bg-[#6BB1A0] text-white px-6 py-3 rounded-xl shadow-md w-full hover:bg-[#58a88f] transition"
              onClick={() => router.back()}
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
