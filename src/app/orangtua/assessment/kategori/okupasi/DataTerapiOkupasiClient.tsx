"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getParentAssessmentQuestions,
  submitParentAssessment,
} from "@/lib/api/asesmentTerapiOrtu";

type Question = {
  id: number;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options?: string[];
};

type Category = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

const inputStyles = {
  accentColor: "#81B7A9",
};

export default function DataTerapiOkupasiClient() {
  const router = useRouter();
  const search = useSearchParams();
  const assessmentId = search.get("assessment_id");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [activeIdx, setActiveIdx] = useState(0);

  const lastIndex = categories.length - 1;

  // FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        const res = await getParentAssessmentQuestions("parent_okupasi");
        setCategories(
          res.data.groups.map((g: any) => ({
            group_id: g.group_id,
            group_key: g.group_key,
            title: g.title,
            questions: g.questions.map((q: any) => ({
              id: q.id,
              question_number: q.question_number,
              question_text: q.question_text,
              answer_type: q.answer_type,
              answer_options: q.answer_options ?? [],
            })),
          }))
        );
      } catch (e) {
        console.error("Gagal load pertanyaan okupasi:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // LOAD & SAVE LOCAL STORAGE
  useEffect(() => {
    const saved = localStorage.getItem("okupasi_parent_answers");
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("okupasi_parent_answers", JSON.stringify(answers));
  }, [answers]);

  const currentCategory = categories[activeIdx];

  const steps = [
    { label: "Data Umum" },
    { label: "Data Fisioterapi" },
    { label: "Data Terapi Okupasi" },
    { label: "Data Terapi Wicara" },
    { label: "Data Paedagog" },
  ];

  const activeStep = steps.findIndex(
    (step) => step.label === "Data Terapi Okupasi"
  );

  const setAnswer = (qid: number, val: any) =>
    setAnswers((s) => ({ ...s, [qid]: val }));

  const goNext = () => activeIdx < lastIndex && setActiveIdx(activeIdx + 1);
  const goPrev = () => activeIdx > 0 && setActiveIdx(activeIdx - 1);

  const getValue = (qid: number, type?: string) => {
    if (answers.hasOwnProperty(qid)) return answers[qid];
    if (type === "checkbox") return [];
    if (type === "slider") return 1;
    return "";
  };

  const onSubmitAll = async () => {
    if (!assessmentId) {
      alert("Assessment ID tidak ditemukan!");
      return;
    }

    const payload = {
      answers: categories
        .flatMap((cat) =>
          cat.questions.map((q) => {
            const val = answers[q.id];
            if (
              val === undefined ||
              val === null ||
              (Array.isArray(val) && val.length === 0)
            )
              return null;

            return {
              question_id: Number(q.id),
              answer: {
                value:
                  q.answer_type === "checkbox"
                    ? val
                    : q.answer_type === "slider"
                    ? Number(val)
                    : val,
              },
            };
          })
        )
        .filter(Boolean),
    };

    try {
      await submitParentAssessment(assessmentId, "okupasi_parent", payload);
      alert("Jawaban berhasil dikirim!");
      router.push( `/orangtua/assessment/kategori?assessment_id=${assessmentId}`);
    } catch (e) {
      console.error("Error submit okupasi:", e);
      alert("Gagal mengirim jawaban.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentCategory) return null;

  return (
    <ResponsiveOrangtuaLayout>
      {/* CLOSE BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
        >
          ✕
        </button>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center flex-wrap gap-4 justify-center">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex flex-col items-center text-center space-y-2`}>
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
              {i < steps.length - 1 && <div className="w-12 h-px bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 max-w-5xl mx-auto">
        <h4 className="text-base font-semibold text-[#36315B] mb-6">
          {activeIdx + 1}. {currentCategory.title}
        </h4>

        <div className="space-y-6">
          {currentCategory.questions.map((q) => (
            <div key={q.id}>
              {q.answer_type === "yes_only" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <p className="font-medium">{q.question_number}. {q.question_text}</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      style={inputStyles}
                      className="w-5 h-5"
                      checked={getValue(q.id) === "Ya"}
                      onChange={(e) => setAnswer(q.id, e.target.checked ? "Ya" : null)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium mb-2">{q.question_number}. {q.question_text}</p>

                  {q.answer_type === "radio3" && (
                    <div className="flex gap-6 flex-wrap">
                      {q.answer_options?.map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={q.id.toString()}
                            style={inputStyles}
                            checked={getValue(q.id) === opt}
                            onChange={() => setAnswer(q.id, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.answer_type === "checkbox" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.answer_options?.map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            style={inputStyles}
                            checked={getValue(q.id, "checkbox").includes(opt)}
                            onChange={(e) => {
                              const old = getValue(q.id, "checkbox");
                              if (e.target.checked) setAnswer(q.id, [...old, opt]);
                              else setAnswer(q.id, old.filter((x: string) => x !== opt));
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.answer_type === "slider" && (
                    <div className="flex flex-col">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        style={inputStyles}
                        value={getValue(q.id, "slider")}
                        onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                        className="w-full mt-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between mt-10 gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIdx === 0}
            className="px-4 py-2 rounded-lg border w-full sm:w-auto"
          >
            Sebelumnya
          </button>

          {activeIdx < lastIndex ? (
            <button
              type="button"
              onClick={goNext}
              className="px-6 py-2 bg-[#6BB1A0] text-white rounded-lg w-full sm:w-auto"
            >
              Lanjutkan
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmitAll}
              className="px-6 py-2 bg-[#6BB1A0] text-white rounded-lg w-full sm:w-auto"
            >
              Simpan & Kirim
            </button>
          )}
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}