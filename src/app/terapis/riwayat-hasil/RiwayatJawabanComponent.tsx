"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import axiosInstance from "@/lib/axios";
import { getObservationAnswer } from "@/lib/api/observasiSubmit";

type Question = {
  id: number;
  question_code: string;
  age_category: string;
  question_number: number;
  question_text: string;
  score: number;
};

type AnswerDetail = {
  question_number: number;
  question_text: string;
  answer: 0 | 1;
  score_earned: number;
  note: string | null;
  question_code: string;
};

// Mapping kategori lengkap termasuk anak-anak & remaja
const kategoriFullMap: Record<string, string> = {
  BPE: "Perilaku & Emosi",
  BFM: "Fungsi Motorik",
  BBB: "Bahasa & Bicara",
  BKA: "Kognitif & Atensi",
  BS: "Sosial & Emosi",

  // Anak-anak
  APE: "Perilaku & Emosi",
  AFM: "Fungsi Motorik",
  ABB: "Bahasa & Bicara",
  AKA: "Kognitif & Atensi",
  AS:  "Sosial & Emosi",

  // Remaja
  RPE: "Perilaku & Emosi",
  RFM: "Fungsi Motorik",
  RBB: "Bahasa & Bicara",
  RKA: "Kognitif & Atensi",
  RS:  "Sosial & Emosi",
  RK: "Kemandirian",
};

// API untuk pertanyaan
const getObservationQuestions = async (observation_id: string) => {
  const res = await axiosInstance.get(`/observations/${observation_id}?type=question`);
  return res.data.data as Question[];
};

export default function RiwayatJawabanComponent() {
  const searchParams = useSearchParams();
  const observation_id = searchParams.get("observation_id") || searchParams.get("id") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!observation_id) {
        alert("Observation ID tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [questionData, answerDataRaw] = await Promise.all([
          getObservationQuestions(observation_id),
          getObservationAnswer(observation_id),
        ]);

        setQuestions(questionData);

        const answerData = answerDataRaw?.answer_details || [];

        const merged: AnswerDetail[] = questionData.map((q: Question) => {
          const ans = answerData.find((a: any) => a.question_number === q.question_number);
          return {
            question_number: q.question_number,
            question_text: q.question_text,
            score_earned: ans?.score_earned ?? 0,
            answer: ans?.answer ?? 0,
            note: ans?.note ?? null,
            question_code: q.question_code,
          };
        });

        setAnswers(merged);

        // Tab aktif pertama
        const firstPrefix = merged[0]?.question_code.split("-")[0];
        setActiveTab(kategoriFullMap[firstPrefix] || firstPrefix);
      } catch (err) {
        console.error("Gagal ambil data observasi:", err);
        alert("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [observation_id]);

  // Group pertanyaan berdasarkan kategori lengkap
  const groupedQuestions = answers.reduce(
    (acc: Record<string, AnswerDetail[]>, q: AnswerDetail) => {
      const prefix = q.question_code.split("-")[0];
      const kategori = kategoriFullMap[prefix] || prefix;
      if (!acc[kategori]) acc[kategori] = [];
      acc[kategori].push(q);
      return acc;
    },
    {}
  );

  // Calculate scores per category
  const categoryScores = Object.keys(groupedQuestions).reduce((acc, kategori) => {
    const questions = groupedQuestions[kategori];
    const totalScore = questions.reduce((sum, q) => sum + (q.score_earned || 0), 0);
    const maxScore = questions.length * 5; // Assuming max score per question is 5
    acc[kategori] = { totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100) };
    return acc;
  }, {} as Record<string, { totalScore: number; maxScore: number; percentage: number }>);

  const kategoriList = Object.keys(groupedQuestions);
  const totalScore = answers.reduce((acc: number, q: AnswerDetail) => acc + (q.score_earned ?? 0), 0);

  const isKategoriComplete = (k: string) =>
    groupedQuestions[k]?.every((q: AnswerDetail) => q.answer !== null && q.answer !== undefined);

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />
        <main className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
              <div className="w-10 h-10 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm">Memuat jawaban...</p>
            </div>
          ) : answers.length === 0 ? (
            <p className="text-center mt-20 text-gray-500">
              Tidak ada jawaban untuk observasi ini.
            </p>
          ) : (
            <>
              {/* Stepper + Total Score */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex justify-start items-center gap-12 overflow-x-auto">
                  {kategoriList.map((k, i) => {
                    const isActive = activeTab === k;
                    const sudahDiisi = isKategoriComplete(k);
                    const scoreInfo = categoryScores[k];

                    return (
                      <div key={k} className="relative flex flex-col items-center flex-shrink-0">
                        <div
                          onClick={() => setActiveTab(k)}
                          className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold cursor-pointer transition ${
                            isActive
                              ? "bg-[#5F52BF] text-white"
                              : sudahDiisi
                              ? "bg-[#81B7A9] text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          <span className="text-xs">{i + 1}</span>
                          <span className="text-xs">{scoreInfo?.totalScore || 0}</span>
                        </div>

                         {i < kategoriList.length - 1 && (
                            <div
                              className="absolute top-6 h-1"
                              style={{
                                width: "80px",
                                left: "90px",
                                backgroundColor: sudahDiisi ? "#81B7A9" : "#E0E0E0",
                              }}
                            />
                          )}
                        <span className="mt-3 text-sm font-medium text-center w-28 whitespace-nowrap">
                          {k}
                        </span>
                        <span className="text-xs text-gray-500">
                          {scoreInfo?.percentage || 0}% ({scoreInfo?.totalScore || 0}/{scoreInfo?.maxScore || 0})
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total Skor */}
                <div className="text-sl font-bold text-[#36315B] bg-[#E7E4FF] px-4 py-2 rounded-full shadow-sm">
                  Total Skor: {totalScore}
                </div>
              </div>

              {/* Pertanyaan */}
              <div className="space-y-6">
                {groupedQuestions[activeTab]?.map((q: AnswerDetail) => (
                  <div key={q.question_number}>
                    <p className="font-medium">
                      {q.question_number}. {q.question_text}{" "}
                      <span className="text-sm text-[#36315B]">
                        (Score {q.score_earned})
                      </span>
                    </p>

                    <div className="flex gap-4 mt-2 items-center">
                      <input
                        type="text"
                        placeholder="Keterangan"
                        className="border rounded-md p-2 flex-1 bg-gray-100"
                        value={q.note || ""}
                        readOnly
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1">
                          <input type="radio" checked={q.answer === 1} readOnly />
                          Ya
                        </label>
                        <label className="flex items-center gap-1">
                          <input type="radio" checked={q.answer === 0} readOnly />
                          Tidak
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigasi */}
              <div className="flex justify-end items-center mt-8 gap-4">
                {kategoriList.indexOf(activeTab) > 0 && (
                  <button
                    onClick={() =>
                      setActiveTab(
                        kategoriList[kategoriList.indexOf(activeTab) - 1]
                      )
                    }
                    className="bg-white text-[#81B7A9] px-4 py-2 rounded-md border-2 border-[#81B7A9] hover:bg-[#81B7A9] hover:text-white transition"
                  >
                    Sebelumnya
                  </button>
                )}
                {kategoriList.indexOf(activeTab) < kategoriList.length - 1 && (
                  <button
                    onClick={() =>
                      setActiveTab(
                        kategoriList[kategoriList.indexOf(activeTab) + 1]
                      )
                    }
                    className="bg-[#81B7A9] text-white px-4 py-2 rounded-md"
                  >
                    Lanjutkan
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}