"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import questions from "@/data/plbQuestions.json";
import { getAssessmentAnswers } from "@/lib/api/asesment";

// 🔹 Types
type Answer = {
  keterangan?: string;
  penilaian?: number;
};

type QuestionsData = Record<string, string[]>;
type AnswersState = Record<string, Record<number, Answer>>;

export default function RiwayatJawabanPLBPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = params.get("type") || "paedagog";

  const allQuestions: QuestionsData = questions;
  const aspekTabs = Object.keys(allQuestions);

  const [activeAspek, setActiveAspek] = useState<string>(aspekTabs[0]);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [kesimpulan, setKesimpulan] = useState("");

  // 🔹 Ambil data API
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!assessmentId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAssessmentAnswers(assessmentId, type);
        const formattedAnswers: AnswersState = {};

        Object.entries(response || {}).forEach(([key, value]) => {
          const matchScore = key.match(/^(.+?)_(\d+)_score$/);
          const matchDesc = key.match(/^(.+?)_(\d+)_desc$/);

          if (matchScore) {
            const aspekKey = matchScore[1].replace(/_/g, " ");
            const index = Number(matchScore[2]);
            if (!formattedAnswers[aspekKey]) formattedAnswers[aspekKey] = {};
            if (!formattedAnswers[aspekKey][index])
              formattedAnswers[aspekKey][index] = {};
            formattedAnswers[aspekKey][index].penilaian = Number(value);
          }

          if (matchDesc) {
            const aspekKey = matchDesc[1].replace(/_/g, " ");
            const index = Number(matchDesc[2]);
            if (!formattedAnswers[aspekKey]) formattedAnswers[aspekKey] = {};
            if (!formattedAnswers[aspekKey][index])
              formattedAnswers[aspekKey][index] = {};
            formattedAnswers[aspekKey][index].keterangan = String(value);
          }

          if (key === "summary") {
            setKesimpulan(String(value));
          }
        });

        setAnswers(formattedAnswers);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [assessmentId, type]);

  const currentQuestions = allQuestions[activeAspek] || [];
  const aspekTerakhir = aspekTabs[aspekTabs.length - 1];

  // 🔹 Fungsi tombol Lanjutkan
  const handleNext = () => {
    const currentIndex = aspekTabs.indexOf(activeAspek);
    const nextIndex = currentIndex + 1;

    if (nextIndex < aspekTabs.length) {
      setActiveAspek(aspekTabs[nextIndex]);
    }
  };

  // 🔹 Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#36315B] font-medium">
        Memuat riwayat jawaban...
      </div>
    );
  }

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-center mb-6">
            PLB | Aspek {activeAspek}
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {aspekTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAspek(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  activeAspek === tab
                    ? "bg-[#81B7A9] text-white border-[#81B7A9]"
                    : "text-[#36315B] bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Container Konten */}
          <div className="bg-white rounded-xl p-2">
            {currentQuestions.map((question, index) => {
              const ans = answers[activeAspek]?.[index];

              return (
                <div
                  key={index}
                  className="mb-6 p-5 rounded-xl shadow-md bg-white"
                >
                  <p className="font-semibold mb-3">
                    {index + 1}. {question}
                  </p>

                  {/* Keterangan + Penilaian sejajar */}
                  <div className="flex gap-4 mb-3 items-start">
                    {/* Keterangan */}
                    <textarea
                      readOnly
                      className="flex-[4] border border-gray-300 bg-gray-100 rounded-md p-3 text-sm cursor-not-allowed h-15"
                      value={ans?.keterangan || ""}
                    />

                    {/* Penilaian */}
                    <div className="relative flex-[1]">
                      <select
                        disabled
                        className="w-80 border border-gray-300 bg-gray-200 text-gray-600 rounded-md py-4 px-1 cursor-not-allowed appearance-none"
                        value={ans?.penilaian ?? ""}
                      >
                        <option value="">Penilaian</option>
                        <option value={0}>0 - Tidak Mampu</option>
                        <option value={1}>1 - Mulai Mampu</option>
                        <option value={2}>2 - Mampu Dengan Bantuan</option>
                        <option value={3}>3 - Mampu Mandiri</option>
                      </select>

                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Kesimpulan */}
            {activeAspek === aspekTerakhir && (
              <div className="mt-8">
                <h2 className="font-bold mb-3">Kesimpulan</h2>
                <textarea
                  readOnly
                  rows={4}
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-3 cursor-not-allowed"
                  value={kesimpulan}
                />
              </div>
            )}
          </div>

          {/* Tombol Lanjutkan */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-[#81B7A9] text-white px-6 py-2 rounded-lg font-semibold shadow"
            >
              Lanjutkan
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
