"use client";

import React, { useEffect, useState } from "react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useSearchParams } from "next/navigation";
import { getAssessmentAnswers } from "@/lib/api/asesment";

export default function Page() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [step, setStep] = useState(1);

  // TAB UTAMA (WAJIB SESUAI DENGAN KEY BE)
  const tabs = [
    { key: "Pemeriksaan Umum", label: "Pemeriksaan Umum" },
    { key: "Anamnesis Sistem", label: "Anamnesis Sistem" },
    { key: "pemeriksaan_khusus", label: "Pemeriksaan Khusus" }
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  // SUB–TAB PEMERIKSAAN KHUSUS
  const pemeriksaanKhususList = [
    { key: "pemeriksaan_sensoris", label: "Pemeriksaan Sensoris" },
    { key: "pemeriksaan_refleks_primitif", label: "Pemeriksaan Reflek Primitif" },
    { key: "gross_motor_pola_gerak", label: "Gross Motor & Pola Gerak" },
    { key: "test_joint_laxity", label: "Test Joint Laxity" },
    { key: "pemeriksaan_spastisitas", label: "Pemeriksaan Spastisitas" },
    { key: "pemeriksaan_kekuatan_otot", label: "Pemeriksaan Kekuatan Otot" },
    { key: "palpasi_otot", label: "Palpasi Otot" },
    { key: "jenis_spastisitas", label: "Jenis Spastisitas" },
    { key: "test_fungsi_bermain", label: "Test Fungsi Bermain" },
    { key: "Diagnosa Fisioterapi", label: "Diagnosa Fisioterapi" },
  ];
  const [selectedKhusus, setSelectedKhusus] = useState("pemeriksaan_sensoris");

  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // ================== FETCH ANSWER DARI API ==================
  useEffect(() => {
    if (!assessmentId) return;

    const load = async () => {
      setLoading(true);
      const res = await getAssessmentAnswers(assessmentId, "fisio");

      console.log("RAW ANSWERS RESULT ==>", res);
      console.log("KEYS:", Object.keys(res || {}));

      // FIX PALING PENTING
      setAnswers(res || {});

      setLoading(false);
    };

    load();
  }, [assessmentId]);

  // ================== FILTER PERTANYAAN BERDASARKAN TAB ==================
  const filteredQuestions = () => {
    if (!answers) return [];

    if (activeTab === "pemeriksaan_khusus") {
      return answers[selectedKhusus] || [];
    }

    return answers[activeTab] || [];
  };

  // ================== RENDER VALUE JAWABAN ==================
  const renderAnswer = (q: any) => {
    if (!q.answer_value) return "-";

    const value = q.answer_value;

    switch (q.answer_type) {
      case "text":
      case "number":
      case "radio":
      case "select":
        return value;

      case "textarea":
        return <div className="whitespace-pre-line">{value}</div>;

      case "checkbox":
        try {
          const arr = JSON.parse(value);
          return (
            <ul className="list-disc ml-5">
              {arr.map((item: any, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        } catch {
          return value;
        }

      case "radio_with_text":
        try {
          const obj = JSON.parse(value);
          return (
            <div>
              <div>Jawaban: <b>{obj.answer}</b></div>
              {obj.text && <div>Keterangan: {obj.text}</div>}
            </div>
          );
        } catch {
          return value;
        }

      case "multi_segment":
        try {
          const obj = JSON.parse(value);
          return (
            <div className="space-y-1">
              {Object.entries(obj).map(([seg, val], i) => (
                <div key={i} className="flex gap-3">
                  <div className="font-semibold w-24">{seg}:</div>
                  <div>{String(val ?? "-")}</div>
                </div>
              ))}
            </div>
          );
        } catch {
          return value;
        }

      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Memuat jawaban...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />

      <div className="flex-1">
        <HeaderTerapis />

        <div className="p-6">

          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {/* ================== STEP 1 LIST JAWABAN ================== */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Riwayat Jawaban Pemeriksaan</h2>

              <div className="flex gap-6 border-b mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-2 ${
                      activeTab === tab.key
                        ? "border-b-4 border-[#3A9C85] text-[#3A9C85] font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dropdown pemeriksaan khusus */}
              {activeTab === "pemeriksaan_khusus" && (
                <div className="mb-6">
                  <label className="text-sm font-medium">Aspek Pemeriksaan Khusus</label>
                  <select
                    value={selectedKhusus}
                    onChange={(e) => setSelectedKhusus(e.target.value)}
                    className="border rounded-lg px-3 py-2 mt-1 w-full"
                  >
                    {pemeriksaanKhususList.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Daftar jawaban */}
              {filteredQuestions().length === 0 && (
                <div className="text-gray-500">Tidak ada jawaban pada grup ini.</div>
              )}

             {filteredQuestions().map((q: any) => (
  <div key={q.question_id} className="mb-6">
    <div className="font-medium mb-2">
      {q.question_text}
    </div>

    <div className="text-gray-700 border rounded p-3 bg-gray-50">
      {renderAnswer(q)}
    </div>
  </div>
))}



              <div className="flex justify-between mt-8">
                <button className="px-4 py-2 border rounded-lg" onClick={() => setStep(0)}>
                  Sebelumnya
                </button>

                <button
                  className="px-6 py-2 rounded-lg bg-[#3A9C85] text-white"
                  onClick={() => setStep(2)}
                >
                  Diagnosa Fisioterapi
                </button>
              </div>
            </div>
          )}

          {/* ================== STEP 2 – DIAGNOSA ================== */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-6">Diagnosa Fisioterapi</h2>

              {answers["Diagnosa Fisioterapi"]?.length ? (
                answers["Diagnosa Fisioterapi"].map((q: any) => (
                  <div key={q.question_id} className="mb-6">
                    <div className="font-medium mb-2">{q.question_text}</div>
                    <div className="border rounded p-3 bg-gray-50 whitespace-pre-line">
                      {q.answer_value}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Belum ada diagnosa.</div>
              )}

              <button className="mt-4 px-6 py-2 border rounded-lg" onClick={() => setStep(1)}>
                Kembali
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
