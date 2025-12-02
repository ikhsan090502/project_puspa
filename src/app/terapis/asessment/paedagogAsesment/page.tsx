"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

// API
import { submitAssessment, getAssessmentQuestions } from "@/lib/api/asesment";

// ==========================================================
// =============== API INTERFACES ============================
// ==========================================================

export interface ExtraSchemaColumn {
  key: string;
  label: string;
  type: string;
}

export interface ExtraSchema {
  columns: ExtraSchemaColumn[];
}

export interface Question {
  id: number;
  question_code: string;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options: string;
  answer_format: string | null;
  extra_schema: string;
}

export interface Group {
  group_id: number;
  group_key: string;
  title: string;
  filled_by: string;
  sort_order: string;
  questions: Question[];
}

export interface PaedagogData {
  assessment_type: string;
  groups: Group[];
}

export interface PaedagogResponse {
  success: boolean;
  message: string;
  data: PaedagogData;
}

// ==========================================================
// =============== FRONTEND TYPES ===========================
// ==========================================================

type QuestionItem = {
  field: string;
  label: string;
  options: number[];
  id: number; // tambahkan id untuk mapping payload
};

type AspectItem = {
  key: string;
  title: string;
  questions: QuestionItem[];
};

type QuestionsData = AspectItem[];

type Answer = { desc?: string; score?: number };
type AnswersState = Record<string, Record<number, Answer>>;

// ==========================================================
// =============== MAP ANSWERS → PAYLOAD ====================
// ==========================================================

export const mapAnswersToPayload = (answers: {
  questionId: number;
  score: number;
  note?: string;
}[]) => {
  return {
    answers: answers.map((item) => ({
      question_id: Number(item.questionId),
      answer: {
        score: Number(item.score),
        note: item.note || "",
      },
    })),
  };
};

// ==========================================================
// =============== COMPONENT START ===========================
// ==========================================================

export default function PLBAssessmentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const assessmentId = params.get("assessment_id");
  const type = "paedagog";

  const [allQuestions, setAllQuestions] = useState<QuestionsData>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [activeAspek, setActiveAspek] = useState<string>("");
  const [answers, setAnswers] = useState<AnswersState>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [kesimpulan, setKesimpulan] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // FETCH PERTANYAAN
  // ==========================================================

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);

        const res = await getAssessmentQuestions("paedagog");
        const groups: Group[] = res?.groups ?? [];

        if (!groups.length) {
          setAllQuestions([]);
          return;
        }

        const mapped: QuestionsData = groups.map((g) => ({
          key: g.group_key,
          title: g.title,
          questions: g.questions.map((q) => ({
            field: q.question_code,
            label: q.question_text,
            options: JSON.parse(q.answer_options || "[]"),
            id: q.id, // simpan id question untuk payload
          })),
        }));

        setAllQuestions(mapped);
        if (mapped.length > 0) setActiveAspek(mapped[0].key);
      } catch (e) {
        alert("❌ Gagal memuat pertanyaan dari server.");
        setAllQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  // ==========================================================
  // HOOKS
  // ==========================================================

  const aspekTabs = useMemo(() => allQuestions.map((a) => a.key), [allQuestions]);

  const activeAspectObj = useMemo(() => {
    return allQuestions.find((x) => x.key === activeAspek) ?? allQuestions[0];
  }, [activeAspek, allQuestions]);

  const currentQuestions = useMemo(() => {
    return activeAspectObj?.questions ?? [];
  }, [activeAspectObj]);

  const validationStatus = useMemo(() => {
    const status: Record<string, "completed" | "scheduled"> = {};

    aspekTabs.forEach((key) => {
      const aspek = allQuestions.find((a) => a.key === key);
      if (!aspek) {
        status[key] = "scheduled";
        return;
      }

      const total = aspek.questions.length;
      const answered = Object.values(answers[key] || {}).filter(
        (a) => a.score !== undefined
      ).length;

      status[key] = answered >= total ? "completed" : "scheduled";
    });

    return status;
  }, [answers, aspekTabs, allQuestions]);

  const isLast = aspekTabs.indexOf(activeAspek) === aspekTabs.length - 1;
  const isFirst = aspekTabs.indexOf(activeAspek) === 0;

  // ==========================================================
  // CONDITIONAL RETURN
  // ==========================================================

  if (loadingQuestions) {
    return (
      <div className="flex h-screen justify-center items-center text-lg">
        Memuat pertanyaan...
      </div>
    );
  }

  if (!allQuestions.length) {
    return (
      <div className="flex h-screen justify-center items-center text-lg">
        ❌ Tidak ada pertanyaan tersedia.
      </div>
    );
  }

  // ==========================================================
  // FUNCTIONS
  // ==========================================================

  const validateCurrentAspek = () => {
    const qList = currentQuestions;
    const currentAnswers = answers[activeAspek] || {};

    for (let i = 0; i < qList.length; i++) {
      if (!currentAnswers[i] || currentAnswers[i].score === undefined) return false;
    }
    return true;
  };

  const handleDescChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [activeAspek]: {
        ...prev[activeAspek],
        [index]: { ...prev[activeAspek]?.[index], desc: value },
      },
    }));
  };

  const handleScoreSelect = (index: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [activeAspek]: {
        ...prev[activeAspek],
        [index]: { ...prev[activeAspek]?.[index], score: value },
      },
    }));
    setOpenDropdown(null);
  };

  const handleSubmit = async () => {
    if (!assessmentId) return alert("❌ assessment_id tidak ditemukan");

    const allComplete = Object.values(validationStatus).every((v) => v === "completed");

    if (!allComplete) return alert("❌ Lengkapi semua penilaian sebelum menyimpan!");

    // Flatten answers menjadi array sesuai payload baru
    const answersPayload: { questionId: number; score: number; note?: string }[] = [];

    for (const aspek of allQuestions) {
      const akey = aspek.key;

      Object.entries(answers[akey] || {}).forEach(([idx, val]) => {
        const q = aspek.questions[Number(idx)];
        if (val.score !== undefined) {
          answersPayload.push({
            questionId: q.id,
            score: val.score,
            note: val.desc ?? "",
          });
        }
      });
    }

    const payload = mapAnswersToPayload(answersPayload);

    try {
      setLoading(true);
      await submitAssessment(assessmentId, type, payload);
      alert("✅ Penilaian berhasil disimpan!");
      router.push(`/terapis/asessment?type=paedagog&status=completed`);
    } catch (err: any) {
      alert("❌ Gagal menyimpan: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RENDER UI
  // ==========================================================

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

          <h1 className="text-2xl font-bold text-center mb-4">
            PLB | Paedagog {activeAspectObj?.title ?? ""}
          </h1>

          {/* TABS */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {aspekTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAspek(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  activeAspek === tab
                    ? "bg-[#81B7A9]/20 border-[#81B7A9]"
                    : validationStatus[tab] === "completed"
                    ? "bg-[#36315B] text-white border-[#36315B]"
                    : "text-[#36315B]/70 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {allQuestions.find((x) => x.key === tab)?.title}
              </button>
            ))}
          </div>

          {/* QUESTION LIST */}
          <div className="bg-white rounded-xl p-5 shadow">
            {currentQuestions.map((q, i) => {
              const current = answers[activeAspek]?.[i];

              return (
                <div key={i} className="mb-6 p-4 rounded-lg shadow-md">
                  <p className="font-semibold mb-3">
                    {i + 1}. {q.label}
                  </p>

                  <div className="flex items-center gap-4">
                    <input
                      className="flex-1 border rounded-md p-2"
                      placeholder="Keterangan..."
                      value={current?.desc || ""}
                      onChange={(e) => handleDescChange(i, e.target.value)}
                    />

                    <div className="relative w-36">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === i ? null : i)
                        }
                        className="flex justify-between items-center w-full px-3 py-2 border rounded-md bg-gray-50"
                      >
                        {current?.score ?? "Penilaian"}
                        <ChevronDown
                          className={`ml-2 ${
                            openDropdown === i ? "rotate-180" : ""
                          }`}
                          size={16}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdown === i && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute mt-1 w-full bg-white border rounded-md shadow-md z-50"
                          >
                            {q.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleScoreSelect(i, opt)}
                                className="block w-full text-left px-4 py-2 hover:bg-[#81B7A9]/20"
                              >
                                {opt}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLast && (
              <>
                <div className="mt-10 mb-6 bg-[#F8F8F8] p-4 rounded-lg text-sm leading-relaxed">
                  <p className="font-semibold mb-2">Keterangan Penilaian:</p>

                  <p>Nilai 0 : Buruk / Anak belum menguasai aspek</p>
                  <p>
                    Nilai 1 : Kurang baik / Anak menguasai aspek namun tidak
                    konsisten dan butuh bantuan dalam mengerjakannya
                  </p>
                  <p>
                    Nilai 2 : Cukup baik / Anak menguasai aspek secara konsisten
                    dengan sedikit bantuan
                  </p>
                  <p>Nilai 3 : Baik / Anak menguasai aspek</p>
                </div>

                <div className="border-t pt-6">
                  <h2 className="font-bold mb-3">Kesimpulan Assessment</h2>
                  <textarea
                    placeholder="Tulis kesimpulan..."
                    className="w-full border rounded-md p-3 text-sm"
                    value={kesimpulan}
                    onChange={(e) => setKesimpulan(e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={isFirst}
              onClick={() =>
                setActiveAspek(aspekTabs[aspekTabs.indexOf(activeAspek) - 1])
              }
              className="px-6 py-2 rounded-lg border border-[#81B7A9] text-[#81B7A9] disabled:opacity-50"
            >
              ← Sebelumnya
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white ${
                  loading ? "bg-gray-400" : "bg-[#36315B]"
                }`}
              >
                {loading ? "Menyimpan..." : "Simpan & Selesai"}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!validateCurrentAspek()) {
                    alert("❌ Masih ada pertanyaan yang belum dinilai!");
                    return;
                  }
                  setActiveAspek(aspekTabs[aspekTabs.indexOf(activeAspek) + 1]);
                }}
                className="px-6 py-2 rounded-lg text-white bg-[#81B7A9]"
              >
                Lanjutkan →
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
