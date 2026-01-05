"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import {
  getObservationDetail,
  getObservationQuestions,
} from "@/lib/api/observasiSubmit";

// ==================== TypeScript ====================
type Question = {
  id: number;
  question_code?: string;
  age_category?: string;
  question_number: number;
  question_text: string;
};

type AnswerDetail = {
  question_number: number;
  question_text: string;
  answer: number; // 0 | 1
  score_earned: number;
  note: string | null;
  question_code: string;
};

type RawAnswerItem = {
  question_number?: unknown;
  answer?: unknown;
  score_earned?: unknown;
  note?: unknown;
};

type AnswerApiResponse = {
  answer_details?: unknown;
  total_score?: unknown;
};

// Mapping kategori lengkap
const kategoriFullMap: Record<string, string> = {
  BPE: "Perilaku & Emosi",
  BFM: "Fungsi Motorik",
  BBB: "Bahasa & Bicara",
  BKA: "Kognitif & Atensi",
  BS: "Sosial & Emosi",

  APE: "Perilaku & Emosi",
  AFM: "Fungsi Motorik",
  ABB: "Bahasa & Bicara",
  AKA: "Kognitif & Atensi",
  AS: "Sosial & Emosi",

  RPE: "Perilaku & Emosi",
  RFM: "Fungsi Motorik",
  RBB: "Bahasa & Bicara",
  RKA: "Kognitif & Atensi",
  RS: "Sosial & Emosi",
  RK: "Kemandirian",
};

// ==================== Helpers ====================
function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function toQuestionArray(input: unknown): Question[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((row: any) => {
      const id = asNumber(row?.id, 0);
      const question_number = asNumber(row?.question_number, NaN);
      const question_text = asString(row?.question_text, "").trim();

      if (!id || !Number.isFinite(question_number) || !question_text) return null;

      const q: Question = {
        id,
        question_number,
        question_text,
        question_code: asString(row?.question_code, undefined as any),
        age_category: asString(row?.age_category, undefined as any),
      };

      // rapikan undefined supaya tidak jadi "" kalau tidak ada
      if (!q.question_code) delete (q as any).question_code;
      if (!q.age_category) delete (q as any).age_category;

      return q;
    })
    .filter(Boolean) as Question[];
}

function toAnswerDetailsArray(input: unknown): RawAnswerItem[] {
  // answer_details kadang undefined / object / array
  if (!Array.isArray(input)) return [];
  return input as RawAnswerItem[];
}

// ==================== Page ====================
export default function RiwayatJawabanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const observation_id =
    searchParams.get("observation_id") || searchParams.get("id") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");
  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!observation_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1) total skor (completed)
        const detailCompleted = (await getObservationDetail(
          observation_id,
          "completed"
        )) as AnswerApiResponse | null;

        if (cancelled) return;

        setTotalScore(asNumber(detailCompleted?.total_score, 0));

        // 2) pertanyaan
        const questionRaw = await getObservationQuestions(observation_id);
        const questionData = toQuestionArray(questionRaw);

        if (cancelled) return;

        setQuestions(questionData);

        // 3) jawaban (type=answer)
        const answerRes = (await getObservationDetail(
          observation_id,
          "answer"
        )) as AnswerApiResponse | null;

        const answerDetails = toAnswerDetailsArray(answerRes?.answer_details);

        // 4) merge: pertanyaan + jawaban
        const merged: AnswerDetail[] = questionData.map((q) => {
          const jawaban = answerDetails.find(
            (a) =>
              asNumber(a?.question_number, -1) === asNumber(q.question_number, -2)
          );

          return {
            question_number: asNumber(q.question_number, 0),
            question_text: q.question_text,
            score_earned: asNumber(jawaban?.score_earned, 0),
            answer: asNumber(jawaban?.answer, 0),
            note:
              jawaban?.note === null || jawaban?.note === undefined
                ? null
                : asString(jawaban?.note, ""),
            question_code: asString(q.question_code, "UNK-0") || "UNK-0",
          };
        });

        if (cancelled) return;

        setAnswers(merged);

        // default tab pertama
        if (merged.length > 0) {
          const firstPrefix = (merged[0].question_code || "UNK-0").split("-")[0];
          setActiveTab(kategoriFullMap[firstPrefix] || firstPrefix);
        } else {
          setActiveTab("");
        }
      } catch (err) {
        console.error("Gagal ambil data observasi:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [observation_id]);

  // ==================== Grouping pertanyaan per kategori ====================
  const groupedQuestions = useMemo(() => {
    return answers.reduce((acc: Record<string, AnswerDetail[]>, q) => {
      const prefix = (q.question_code || "UNK-0").split("-")[0];
      const kategori = kategoriFullMap[prefix] || prefix;
      if (!acc[kategori]) acc[kategori] = [];
      acc[kategori].push(q);
      return acc;
    }, {});
  }, [answers]);

  const kategoriList = Object.keys(groupedQuestions);

  const isKategoriComplete = (k: string) =>
    groupedQuestions[k]?.every((q) => q.answer !== null && q.answer !== undefined);

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-50">
        <Header />

        <main className="p-6 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => router.replace("/admin/jadwal_observasi?tab=selesai")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

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

                    return (
                      <div
                        key={k}
                        className="relative flex flex-col items-center flex-shrink-0"
                      >
                        <div
                          onClick={() => setActiveTab(k)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition ${
                            isActive
                              ? "bg-[#5F52BF] text-white"
                              : sudahDiisi
                              ? "bg-[#81B7A9] text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {i + 1}
                        </div>

                        {i < kategoriList.length - 1 && (
                          <div
                            className="absolute top-5 h-1"
                            style={{
                              width: "80px",
                              left: "85px",
                              backgroundColor: sudahDiisi ? "#81B7A9" : "#E0E0E0",
                            }}
                          />
                        )}

                        <span className="mt-3 text-sm font-medium text-center w-28 whitespace-nowrap">
                          {k}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-sl font-bold text-[#36315B] bg-[#E7E4FF] px-3 py-1 rounded-full shadow-sm">
                  Total Skor: {totalScore}
                </div>
              </div>

              {/* Pertanyaan */}
              <div className="space-y-6">
                {groupedQuestions[activeTab]?.map((q) => (
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
                          <input type="radio" checked={Number(q.answer) === 1} readOnly />
                          Ya
                        </label>

                        <label className="flex items-center gap-1">
                          <input type="radio" checked={Number(q.answer) === 0} readOnly />
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
                    type="button"
                    onClick={() =>
                      setActiveTab(kategoriList[kategoriList.indexOf(activeTab) - 1])
                    }
                    className="bg-white text-[#81B7A9] px-4 py-2 rounded-md border-2 border-[#81B7A9] hover:bg-[#81B7A9] hover:text-white transition"
                  >
                    Sebelumnya
                  </button>
                )}

                {kategoriList.indexOf(activeTab) < kategoriList.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(kategoriList[kategoriList.indexOf(activeTab) + 1])
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
