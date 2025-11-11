"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import questions from "@/data/plbQuestions.json";
import { getAssessmentAnswers } from "@/lib/api/asesment";

// 🔹 Type definitions
type Answer = {
  keterangan?: string;
  penilaian?: number;
};

type QuestionsData = Record<string, string[]>;
type AnswersState = Record<string, Record<number, Answer>>;

// 🔹 Komponen utama
export default function RiwayatJawabanPLBPage() {
  const params = useSearchParams();
  const router = useRouter();
  const assessmentId = params.get("assessment_id");
  const type = params.get("type") || "paedagog";

  const allQuestions: QuestionsData = questions;
  const aspekTabs = Object.keys(allQuestions);
  const [activeAspek, setActiveAspek] = useState<string>(aspekTabs[0]);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [kesimpulan, setKesimpulan] = useState("");

  // 🔹 Ambil data jawaban dari API
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!assessmentId) {
        console.warn("❌ Tidak ada assessment_id di URL");
        setLoading(false);
        return;
      }

      try {
        console.log(`📥 Mengambil riwayat jawaban untuk ID: ${assessmentId}, type: ${type}`);
        const response = await getAssessmentAnswers(assessmentId, type);

        const formattedAnswers: AnswersState = {};

        // Parsing hasil API ke bentuk { aspek: { index: { penilaian, keterangan } } }
        if (response && typeof response === "object") {
          Object.entries(response).forEach(([key, value]) => {
            const matchScore = key.match(/^(.+?)_(\d+)_score$/);
            const matchDesc = key.match(/^(.+?)_(\d+)_desc$/);

            if (matchScore) {
              const aspekKey = matchScore[1].replace(/_/g, " ");
              const idx = Number(matchScore[2]);
              if (!formattedAnswers[aspekKey]) formattedAnswers[aspekKey] = {};
              if (!formattedAnswers[aspekKey][idx]) formattedAnswers[aspekKey][idx] = {};
              formattedAnswers[aspekKey][idx].penilaian = Number(value);
            }

            if (matchDesc) {
              const aspekKey = matchDesc[1].replace(/_/g, " ");
              const idx = Number(matchDesc[2]);
              if (!formattedAnswers[aspekKey]) formattedAnswers[aspekKey] = {};
              if (!formattedAnswers[aspekKey][idx]) formattedAnswers[aspekKey][idx] = {};
              formattedAnswers[aspekKey][idx].keterangan = String(value);
            }

            if (key === "summary" && typeof value === "string") {
              setKesimpulan(value);
            }
          });
        }

        setAnswers(formattedAnswers);
        console.log("✅ Riwayat jawaban berhasil dimuat:", formattedAnswers);
      } catch (error) {
        console.error("❌ Gagal memuat riwayat jawaban:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [assessmentId, type]);

  // 🔹 Hitung status tiap aspek (lengkap/tidak)
  const validationStatus = useMemo(() => {
    const statusMap: Record<string, "complete" | "incomplete"> = {};
    aspekTabs.forEach((aspek) => {
      const total = allQuestions[aspek]?.length || 0;
      const answered = Object.values(answers[aspek] || {}).filter(
        (a) => a.penilaian !== undefined
      ).length;
      statusMap[aspek] =
        total > 0 && answered >= total ? "complete" : "incomplete";
    });
    return statusMap;
  }, [answers, aspekTabs, allQuestions]);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#36315B] font-medium">
        Memuat riwayat jawaban...
      </div>
    );
  }

  const currentQuestions = allQuestions[activeAspek] || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />

        <main className="flex-1 p-6 flex flex-col overflow-hidden">
          <h1 className="text-2xl font-bold text-[#36315B] mb-4 text-center">
            📘 Riwayat Jawaban PLB | Aspek {activeAspek}
          </h1>

          {/* Tabs Aspek */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {aspekTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAspek(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeAspek === tab
                    ? "bg-[#81B7A9]/20 border-[#81B7A9] text-[#36315B]"
                    : validationStatus[tab] === "complete"
                    ? "bg-[#36315B] text-white border-[#36315B]"
                    : "text-[#36315B]/70 hover:bg-gray-100 border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Daftar pertanyaan */}
          <div className="bg-white rounded-xl shadow-md flex-1 overflow-y-auto p-6">
            {currentQuestions.map((q, i) => {
              const answer = answers[activeAspek]?.[i];
              return (
                <div
                  key={i}
                  className="mb-6 pb-5 bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                >
                  <p className="font-semibold mb-3 text-[#36315B]">
                    {i + 1}. {q}
                  </p>
                  <div className="flex flex-col gap-3">
                    <textarea
                      readOnly
                      className="w-full resize-none border border-gray-200 rounded-md p-2.5 text-sm bg-gray-100 cursor-not-allowed"
                      value={answer?.keterangan || ""}
                    />
                    <div className="w-40 text-center font-semibold text-[#36315B] bg-gray-200 rounded-md py-2 select-none">
                      Penilaian: {answer?.penilaian ?? "-"}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Kesimpulan */}
            <div className="mt-10 border-t pt-6">
              <h2 className="font-bold text-[#36315B] mb-3">Kesimpulan</h2>
              <textarea
                readOnly
                value={kesimpulan}
                rows={5}
                className="w-full resize-none border border-gray-300 rounded-md p-3 text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
