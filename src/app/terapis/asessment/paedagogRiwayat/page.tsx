"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

import { getAssessmentAnswers } from "@/lib/api/asesment";

// ----------------- TYPE -----------------
type RawQuestionItem = {
  question_number: string;
  question_id: string;
  question_text: string;
  answer_type: string;
  answer_value: string; // JSON string like {"score":1,"note":"..."}
  section?: string;
  group_title?: string;
  sort_order?: string;
};

type AnswersApiResponseData = Record<string, RawQuestionItem[]>;

type ParsedAnswer = {
  score: number | null;
  note: string;
};

type AnswersState = Record<string, Record<number, ParsedAnswer>>;

// ----------------- HELPERS -----------------
const parseAnswerValue = (val: string) => {
  try {
    // BE sometimes returns answer_value as JSON-string, sometimes null/empty
    if (!val) return { score: null, note: "" };
    // if already an object (rare), handle it
    if (typeof val === "object") {
      return {
        score: (val as any).score ?? null,
        note: (val as any).note ?? "",
      };
    }
    const parsed = JSON.parse(val);
    return {
      score: typeof parsed?.score === "number" ? parsed.score : null,
      note: parsed?.note ?? "",
    };
  } catch (err) {
    // fallback: try to parse unescaped JSON inside string (some BE wrap twice)
    try {
      const double = JSON.parse(JSON.parse(val));
      return {
        score: typeof double?.score === "number" ? double.score : null,
        note: double?.note ?? "",
      };
    } catch {
      return { score: null, note: "" };
    }
  }
};

// sort group keys by their sort_order (min sort_order among group's items)
const orderGroupKeys = (data: AnswersApiResponseData) => {
  const keys = Object.keys(data);
  return keys.sort((a, b) => {
    const arrA = data[a] ?? [];
    const arrB = data[b] ?? [];
    const minA =
      arrA.length > 0
        ? Math.min(
            ...arrA.map((i) =>
              Number.isFinite(Number(i.sort_order)) ? Number(i.sort_order) : 999
            )
          )
        : 999;
    const minB =
      arrB.length > 0
        ? Math.min(
            ...arrB.map((i) =>
              Number.isFinite(Number(i.sort_order)) ? Number(i.sort_order) : 999
            )
          )
        : 999;
    return minA - minB;
  });
};

// ----------------- PAGE -----------------
export default function RiwayatJawabanPaedagogPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id") ?? "";

  // type param in URL expected like "paedagog" / "wicara" / "okupasi" / "fisio"
  let typeRaw = (params.get("type") as
    | "paedagog"
    | "okupasi"
    | "wicara"
    | "fisio") || "paedagog";

  const type =
    typeRaw === "wicara"
      ? "wicara_oral"
      : (typeRaw as
          | "paedagog"
          | "okupasi"
          | "wicara_oral"
          | "wicara_bahasa"
          | "fisio");

  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<AnswersApiResponseData>({});
  const [answers, setAnswers] = useState<AnswersState>({});
  const [completedAspek, setCompletedAspek] = useState<Record<string, boolean>>(
    {}
  );
  const [kesimpulan, setKesimpulan] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // aspek order & active
  const [aspekOrder, setAspekOrder] = useState<string[]>([]);
  const [activeAspek, setActiveAspek] = useState<string>("");

  useEffect(() => {
    if (!assessmentId) {
      setErrorMsg("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      setErrorMsg("");
      try {
        const raw = (await getAssessmentAnswers(
          assessmentId,
          type as any
        )) as any;

        // BE wrapper: { success, message, data: { "Membaca": [...], ... , maybe summary_text } }
        const data = (raw && raw.data) || raw || {};

        // extract possible summary: summary_text or summary
        const rawSummary = data.summary_text ?? data.summary ?? "";
        const summary =
          Array.isArray(rawSummary) ? rawSummary.join("\n") : String(rawSummary);

        // remove summary from data object if present
        const copy: AnswersApiResponseData = { ...data };
        delete (copy as any).summary_text;
        delete (copy as any).summary;
        delete (copy as any).data; // safe guard

        setRawData(copy);
        setKesimpulan(summary ?? "");

        // order groups
        const ordered = orderGroupKeys(copy);
        setAspekOrder(ordered);
        setActiveAspek((prev) => (ordered.length > 0 ? ordered[0] : ""));

        // build answers mapping
        const formatted: AnswersState = {};
        for (const [groupTitle, arr] of Object.entries(copy)) {
          formatted[groupTitle] = {};
          if (!Array.isArray(arr)) continue;

          // sort questions by question_number (numeric) then sort_order
          const sorted = arr.slice().sort((x, y) => {
            const na = Number(x.question_number ?? 9999);
            const nb = Number(y.question_number ?? 9999);
            if (na !== nb) return na - nb;
            const sa = Number(x.sort_order ?? 9999);
            const sb = Number(y.sort_order ?? 9999);
            return sa - sb;
          });

          sorted.forEach((item) => {
            const id = Number(item.question_id);
            const parsed = parseAnswerValue(item.answer_value);
            formatted[groupTitle][id] = {
              score: parsed.score,
              note: parsed.note,
            };
          });
        }

        setAnswers(formatted);

        // completed aspek detection
        const comp: Record<string, boolean> = {};
        for (const k of Object.keys(formatted)) {
          comp[k] = Object.values(formatted[k]).some((v) => v.score !== null);
        }
        setCompletedAspek(comp);
      } catch (err: any) {
        console.error("Gagal fetch answers:", err);
        setErrorMsg("Gagal memuat riwayat jawaban. Cek console untuk detail.");
        setRawData({});
        setAnswers({});
        setKesimpulan("");
        setAspekOrder([]);
        setActiveAspek("");
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [assessmentId, type]);

  // navigation helpers
  const currentIndex = aspekOrder.indexOf(activeAspek);
  const goPrev = () => {
    if (currentIndex > 0) setActiveAspek(aspekOrder[currentIndex - 1]);
  };
  const goNext = () => {
    if (currentIndex < aspekOrder.length - 1)
      setActiveAspek(aspekOrder[currentIndex + 1]);
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-[#36315B] font-medium">
        Memuat riwayat jawaban...
      </div>
    );

  if (errorMsg)
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600 font-medium">
        {errorMsg}
      </div>
    );

  if (aspekOrder.length === 0)
    return (
      <div className="flex min-h-screen items-center justify-center text-[#36315B] font-medium">
        Tidak ada riwayat jawaban.
      </div>
    );

  // derive current questions for active aspek
  const currentQuestionsRaw = rawData[activeAspek] ?? [];
  const currentQuestions = Array.isArray(currentQuestionsRaw)
    ? currentQuestionsRaw.slice().sort((x, y) => {
        const na = Number(x.question_number ?? 9999);
        const nb = Number(y.question_number ?? 9999);
        if (na !== nb) return na - nb;
        const sa = Number(x.sort_order ?? 9999);
        const sb = Number(y.sort_order ?? 9999);
        return sa - sb;
      })
    : [];

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-6 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">
            PLB | Aspek {activeAspek}
          </h1>

          {/* TOP TABS (still present but we show only 1 aspek content at a time) */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {aspekOrder.map((tabKey, i) => {
              const isActive = activeAspek === tabKey;
              const isCompleted = completedAspek[tabKey] === true;
              return (
                <button
                  key={tabKey + i}
                  onClick={() => setActiveAspek(tabKey)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition
                    ${
                      isActive
                        ? "bg-[#81B7A9] text-white border-[#81B7A9]"
                        : isCompleted
                        ? "bg-[#36315B] text-white border-[#36315B]"
                        : "text-[#36315B] bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {tabKey}
                </button>
              );
            })}
          </div>

          {/* QUESTIONS CARD */}
          <div className="bg-white rounded-xl p-2">
            {currentQuestions.map((q) => {
              const qId = Number(q.question_id);
              const ans = answers[activeAspek]?.[qId];

              return (
                <div
                  key={qId}
                  className="mb-6 p-5 rounded-xl shadow-md bg-white"
                >
                  <p className="font-semibold mb-3">
                    {q.question_number}. {q.question_text}
                  </p>

                  <div className="flex gap-4 mb-3 items-start">
                    <textarea
                      readOnly
                      className="flex-[4] border border-gray-300 bg-gray-100 rounded-md p-3 text-sm cursor-not-allowed h-15"
                      value={ans?.note ?? ""}
                    />

                    <div className="relative flex-[1]">
                      <select
                        disabled
                        className="w-80 border border-gray-300 bg-gray-200 text-gray-600 rounded-md py-4 px-1 cursor-not-allowed appearance-none"
                        value={
                          typeof ans?.score === "number" ? String(ans?.score) : ""
                        }
                      >
                        <option value="">Penilaian</option>
                        <option value="0">0 - Buruk</option>
                        <option value="1">1 - Kurang Baik</option>
                        <option value="2">2 - Cukup Baik</option>
                        <option value="3">3 - Baik</option>
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

            {/* KESIMPULAN: tampilkan hanya di halaman terakhir (opsional) */}
            {aspekOrder.indexOf(activeAspek) === aspekOrder.length - 1 &&
              kesimpulan && (
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

          {/* NAV BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              onClick={goPrev}
              disabled={currentIndex <= 0}
              className={`px-6 py-2 rounded-lg font-semibold shadow ${
                currentIndex <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-[#36315B] hover:bg-gray-200"
              }`}
            >
              Sebelumnya
            </button>

            <div className="flex gap-3 items-center">
              <div className="text-sm text-gray-600">
                
              </div>
              <button
                onClick={goNext}
                disabled={currentIndex >= aspekOrder.length - 1}
                className={`px-6 py-2 rounded-lg font-semibold shadow ${
                  currentIndex >= aspekOrder.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#81B7A9] text-white hover:bg-[#699e8b]"
                }`}
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
