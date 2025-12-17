"use client";

import React, { useEffect, useState } from "react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useSearchParams } from "next/navigation";
import { getAssessmentAnswers } from "@/lib/api/asesment";

/* ================== RANGE SESUAI BE ================== */
/* ================== RANGE SESUAI BE (FIXED) ================== */
const GROUP_RANGE: Record<string, [number, number]> = {
  /* ===== TAB 1 ===== */
  "Pemeriksaan Umum": [316, 324],

  /* ===== TAB 2 ===== */
  "Anamnesis Sistem": [325, 333],

  /* ===== TAB 3 : PEMERIKSAAN KHUSUS ===== */
  pemeriksaan_sensoris: [334, 340],

  pemeriksaan_refleks_primitif: [341, 356],

  gross_motor_pola_gerak: [357, 394],

  test_joint_laxity: [395, 399],

  pemeriksaan_spastisitas: [400, 405],

  pemeriksaan_kekuatan_otot: [406, 410],

  palpasi_otot: [411, 414],
  
  jenis_spastisitas: [415, 419],

  test_fungsi_bermain: [420, 426],

  /* ===== DIAGNOSA ===== */
  "Diagnosa Fisioterapi": [427, 429],
};


export default function Page() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [activeTab, setActiveTab] = useState("Pemeriksaan Umum");
  const [selectedKhusus, setSelectedKhusus] =
    useState("pemeriksaan_sensoris");
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: "Pemeriksaan Umum", label: "Pemeriksaan Umum" },
    { key: "Anamnesis Sistem", label: "Anamnesis Sistem" },
    { key: "pemeriksaan_khusus", label: "Pemeriksaan Khusus" },
  ];

  /* 🔥 DIAGNOSA MASUK DROPDOWN */
  const pemeriksaanKhususList = [
    { key: "pemeriksaan_sensoris", label: "Pemeriksaan Sensoris" },
    { key: "pemeriksaan_refleks_primitif", label: "Pemeriksaan Reflek Primitif" },
    { key: "gross_motor_pola_gerak", label: "Gross Motor & Pola Gerak" },
    { key: "test_joint_laxity", label: "Test Joint Laxity" },
    { key: "pemeriksaan_spastisitas", label: "Pemeriksaan Spastisitas" },
    { key: "jenis_spastisitas", label: "Jenis Spastisitas" },
    { key: "test_fungsi_bermain", label: "Test Fungsi Bermain" },
    { key: "Diagnosa Fisioterapi", label: "Diagnosa Fisioterapi" },
  ];

  /* ================== FETCH DATA ================== */
  useEffect(() => {
    if (!assessmentId) return;

    const load = async () => {
      setLoading(true);
      const data = await getAssessmentAnswers(assessmentId, "fisio");
      setAnswers(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    load();
  }, [assessmentId]);

  /* ================== FILTER ================== */
  const filteredQuestions = () => {
    let key = activeTab;

    if (activeTab === "pemeriksaan_khusus") {
      key = selectedKhusus;
    }

    const range = GROUP_RANGE[key];
    if (!range) return [];

    return answers.filter((q) => {
      const id = Number(q.question_id);
      return id >= range[0] && id <= range[1];
    });
  };

  /* ================== RENDER JAWABAN ================== */
  const renderAnswer = (q: any) => {
    const ans = q.answer;
    if (!ans) return "-";

    // ARRAY (Diagnosa)
    if (Array.isArray(ans.value)) {
      return (
        <ul className="list-disc ml-5">
          {ans.value.map((v: string, i: number) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      );
    }

    // OBJECT KOMPLEKS
    if (typeof ans === "object" && !ans.value) {
      return (
        <div className="space-y-1">
          {Object.entries(ans).map(([k, v]: any, i) => (
            <div key={i} className="flex gap-3">
              <div className="font-semibold w-32">{k}</div>
              <div>
                {typeof v === "object"
                  ? v.value ?? JSON.stringify(v)
                  : String(v)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return ans.value ?? "-";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Riwayat Jawaban Pemeriksaan
            </h2>

            {/* TAB */}
            <div className="flex gap-6 border-b mb-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`pb-2 ${
                    activeTab === t.key
                      ? "border-b-4 border-[#3A9C85] text-[#3A9C85]"
                      : "text-gray-500"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* DROPDOWN */}
            {activeTab === "pemeriksaan_khusus" && (
              <select
                className="border p-2 rounded mb-6 w-full"
                value={selectedKhusus}
                onChange={(e) => setSelectedKhusus(e.target.value)}
              >
                {pemeriksaanKhususList.map((i) => (
                  <option key={i.key} value={i.key}>
                    {i.label}
                  </option>
                ))}
              </select>
            )}

            {/* CONTENT */}
            {filteredQuestions().length === 0 && (
              <div className="text-gray-500">
                Tidak ada jawaban pada bagian ini.
              </div>
            )}

          
          {filteredQuestions().map((q) => (
  <div key={q.question_id} className="mb-6">
    <div className="font-medium mb-2">{q.question_text}</div>

    {/* FIELD JAWABAN */}
    <div className="bg-gray-50 border p-3 rounded">
      {renderAnswer(q)}
    </div>

    {/* FIELD CATATAN (HANYA JIKA ADA) */}
    {q.note && (
      <div className="mt-3">
        <div className="text-sm font-bold text-[#3A9C85] mb-1">
          Catatan
        </div>
        <div className="bg-gray-50 border p-3 rounded">
          {q.note}
        </div>
      </div>
    )}
  </div>
))}

          </div>
        </div>
      </div>
    </div>
  );
}
