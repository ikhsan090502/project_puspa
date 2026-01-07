"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { getObservationDetail, getObservationQuestions } from "@/lib/api/observasiSubmit";

// ==================== Types ====================
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
  answer: number | null; // null kalau tidak ada jawaban
  score_earned: number | null;
  note: string | null;
  question_code: string;
};

type RawAnswerItem = {
  question_number?: unknown;
  answer?: unknown;
  score_earned?: unknown;
  note?: unknown;
};

type ObservationDetailApi = {
  total_score?: unknown;
  answer_details?: unknown;
  data?: unknown;
};

// ==================== Kategori map ====================
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
function asNumber(v: unknown, fallback: number | null = null): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function asNumber0(v: unknown, fallback = 0): number {
  return Number(asNumber(v, fallback) ?? fallback);
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

/**
 * Normalizer pertanyaan:
 * - array langsung
 * - { data: [...] }
 * - { questions: [...] }
 * - { data: { questions: [...] } }
 * - { data: { data: [...] } }
 * - { data: { groups: [{ questions: [...] }] } }
 */
function extractQuestionArray(input: unknown): any[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  const obj: any = input;

  if (Array.isArray(obj?.data)) return obj.data;
  if (Array.isArray(obj?.questions)) return obj.questions;

  if (Array.isArray(obj?.data?.questions)) return obj.data.questions;
  if (Array.isArray(obj?.data?.data)) return obj.data.data;

  const groupQs = obj?.data?.groups?.[0]?.questions;
  if (Array.isArray(groupQs)) return groupQs;

  return [];
}

function toQuestionArray(input: unknown): Question[] {
  const arr = extractQuestionArray(input);

  return arr
    .map((row: any) => {
      const id = asNumber(row?.id, null);
      const question_number = asNumber(row?.question_number, null);
      const question_text = asString(row?.question_text, "").trim();

      if (!id || !question_number || !question_text) return null;

      const question_code = asString(row?.question_code, "").trim();
      const age_category = asString(row?.age_category, "").trim();

      return {
        id,
        question_number,
        question_text,
        ...(question_code ? { question_code } : {}),
        ...(age_category ? { age_category } : {}),
      } as Question;
    })
    .filter(Boolean) as Question[];
}

/**
 * Normalizer answer_details:
 * - array langsung
 * - { answer_details: [...] }
 * - { data: [...] }
 * - { data: { answer_details: [...] } }
 */
function extractAnswerDetailsArray(input: unknown): RawAnswerItem[] {
  if (!input) return [];
  if (Array.isArray(input)) return input as RawAnswerItem[];

  const obj: any = input;

  if (Array.isArray(obj?.answer_details)) return obj.answer_details as RawAnswerItem[];
  if (Array.isArray(obj?.data)) return obj.data as RawAnswerItem[];
  if (Array.isArray(obj?.data?.answer_details)) return obj.data.answer_details as RawAnswerItem[];

  return [];
}

// ==================== Page ====================
export default function RiwayatJawabanClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const observation_id =
    searchParams.get("observation_id") ||
    searchParams.get("id") ||
    searchParams.get("observationId") ||
    "";

  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");
  const [totalScore, setTotalScore] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!observation_id) {
        setErrorMsg("ID observasi tidak ditemukan di URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMsg(null);

        // 1) total skor (completed)
        const detailCompleted = (await getObservationDetail(
          observation_id,
          "completed"
        )) as ObservationDetailApi | null;

        if (cancelled) return;

        setTotalScore(asNumber0(detailCompleted?.total_score, 0));

        // 2) pertanyaan
        const questionRaw = await getObservationQuestions(observation_id);
        const questionData = toQuestionArray(questionRaw);

        if (cancelled) return;

        // 3) jawaban (type=answer)
        const answerRes = (await getObservationDetail(
          observation_id,
          "answer"
        )) as ObservationDetailApi | null;

        // ✅ FIX PENTING: kirim answerRes utuh, bukan answerRes.answer_details
        const answerDetails = extractAnswerDetailsArray(answerRes);

        // 4) merge
        const merged: AnswerDetail[] = questionData.map((q) => {
          const found = answerDetails.find(
            (a) => Number(asNumber(a?.question_number, -1) ?? -1) === q.question_number
          );

          const ans = asNumber(found?.answer, null);
          const score = asNumber(found?.score_earned, null);

          return {
            question_number: q.question_number,
            question_text: q.question_text,
            score_earned: score,
            answer: ans,
            note:
              found?.note === null || found?.note === undefined
                ? null
                : asString(found?.note, ""),
            question_code: asString(q.question_code, "UNK-0") || "UNK-0",
          };
        });

        if (cancelled) return;

        setAnswers(merged);

        // default tab
        if (merged.length > 0) {
          const firstPrefix = (merged[0].question_code || "UNK-0").split("-")[0];
          setActiveTab(kategoriFullMap[firstPrefix] || firstPrefix);
        } else {
          setActiveTab("");
        }
      } catch (err) {
        console.error("Gagal ambil data observasi:", err);
        setErrorMsg("Gagal memuat data. Cek console / API response.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [observation_id]);

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
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-6 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => router.replace("/terapis/observasi/riwayat")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
              <div className="w-10 h-10 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Memuat jawaban...</p>
            </div>
          ) : errorMsg ? (
            <div className="bg-white border rounded-xl p-5 text-center text-red-600 font-medium">
              {errorMsg}
            </div>
          ) : answers.length === 0 ? (
            <p className="text-center mt-20 text-gray-500">
              Tidak ada jawaban untuk observasi ini.
            </p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div className="flex justify-start items-center gap-12 overflow-x-auto">
                  {kategoriList.map((k, i) => {
                    const isActive = activeTab === k;
                    const sudahDiisi = isKategoriComplete(k);

                    return (
                      <div key={k} className="relative flex flex-col items-center flex-shrink-0">
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

                <div className="text-sm font-bold text-[#36315B] bg-[#E7E4FF] px-3 py-1 rounded-full shadow-sm">
                  Total Skor: {totalScore}
                </div>
              </div>

              <div className="space-y-6">
                {(groupedQuestions[activeTab] || []).map((q) => (
                  <div key={q.question_number}>
                    <p className="font-medium">
                      {q.question_number}. {q.question_text}{" "}
                      <span className="text-sm text-[#36315B]">(Score {q.score_earned ?? 0})</span>
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
                          <input
                            type="radio"
                            checked={q.answer === 1}
                            readOnly
                            className="w-4 h-4 accent-[#81B7A9]"
                          />
                          Ya
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            checked={q.answer === 0}
                            readOnly
                            className="w-4 h-4 accent-[#81B7A9]"
                          />
                          Tidak
                        </label>

                        {q.answer === null && (
                          <span className="text-xs text-gray-500 ml-2">(belum dijawab)</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end items-center mt-8 gap-4">
                {kategoriList.indexOf(activeTab) > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(kategoriList[kategoriList.indexOf(activeTab) - 1])}
                    className="bg-white text-[#81B7A9] px-4 py-2 rounded-md border-2 border-[#81B7A9] hover:bg-[#81B7A9] hover:text-white transition"
                  >
                    Sebelumnya
                  </button>
                )}

                {kategoriList.indexOf(activeTab) < kategoriList.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(kategoriList[kategoriList.indexOf(activeTab) + 1])}
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
