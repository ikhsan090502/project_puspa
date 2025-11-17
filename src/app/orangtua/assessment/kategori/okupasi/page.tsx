"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import dataOkupasi from "@/data/okupasiAssessment.json";

type Q = {
  id: string;
  text: string;
  type?: string;
  options?: string[];
};

type Category = {
  id: string;
  title: string;
  type: string; // radio3 | yes_only | checkbox | likert | slider | likert5radio | radio_single
  questions: Q[];
};

export default function DataTerapiOkupasiPage() {
  const router = useRouter();
  const pathname = usePathname();
  const categories: Category[] = (dataOkupasi as any).categories;

  const lastIndex = categories.length - 1;
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem("okupasi_answers_v1");
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("okupasi_answers_v1", JSON.stringify(answers));
  }, [answers]);

  const currentCategory = categories[activeIdx];

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  const setRadio3 = (qid: string, val: string) =>
    setAnswers((s) => ({ ...s, [qid]: val }));

  const setYes = (qid: string, checked: boolean) =>
    setAnswers((s) => ({ ...s, [qid]: checked ? "Ya" : "" }));

  const setLikert = (qid: string, val: number) =>
    setAnswers((s) => ({ ...s, [qid]: val }));

  const goNext = () => {
    if (activeIdx < lastIndex) setActiveIdx((i) => i + 1);
  };
  const goPrev = () => {
    if (activeIdx > 0) setActiveIdx((i) => i - 1);
  };

  const onSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    localStorage.setItem("okupasi_answers_v1", JSON.stringify(answers));
    if (activeIdx === lastIndex) {
      // misal redirect atau notif simpan sukses
    }
  };

  // === RADIO 3 ===
  const Radio3Table = ({ questions }: { questions: Q[] }) => {
    const opts = ["Ya", "Tidak", "Kadang-kadang"];
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr className="text-[#36315B] text-left font-semibold">
              <th className="w-[60%]">Pertanyaan</th>
              {opts.map((opt) => (
                <th key={opt} className="text-center w-[13%]">{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.id} className="border-b border-gray-200">
                <td className="py-2">{idx + 1}. {q.text}</td>
                {opts.map((opt) => (
                  <td key={opt} className="text-center py-2">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setRadio3(q.id, opt)}
                      className="text-[#6BB1A0] focus:ring-[#6BB1A0]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // === YES ONLY ===
  const YesOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="flex items-center justify-between border-b border-gray-200 pb-3"
        >
          <span className="text-sm text-[#36315B]">{idx + 1}. {q.text}</span>
          <input
            type="checkbox"
            checked={answers[q.id] === "Ya"}
            onChange={() => setYes(q.id, !answers[q.id])}
            className="text-[#6BB1A0]"
          />
        </div>
      ))}
    </div>
  );

  // === LIKERT SLIDER ===
  const LikertSlider = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="bg-gray-50 rounded-xl p-4 border">
          <p className="text-sm text-[#36315B] mb-3">{idx + 1}. {q.text}</p>
          <input
            type="range"
            min={1}
            max={5}
            value={answers[q.id] || 3}
            onChange={(e) => setLikert(q.id, Number(e.target.value))}
            className="w-full accent-[#6BB1A0]"
          />
          <div className="flex justify-between text-xs text-[#36315B] mt-1">
            <span>1</span><span>5</span>
          </div>
        </div>
      ))}
    </div>
  );

  // === CHECKBOX LIST (GRID) ===
  const CheckboxList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-6">
      {questions.map((q) => (
        <div key={q.id}>
          <p className="font-medium text-sm mb-3 text-[#36315B]">{q.text}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options?.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers[q.id]?.includes(opt) || false}
                  onChange={(e) => {
                    const old = answers[q.id] || [];
                    if (e.target.checked) {
                      setAnswers((s) => ({ ...s, [q.id]: [...old, opt] }));
                    } else {
                      setAnswers((s) => ({
                        ...s,
                        [q.id]: old.filter((x: string) => x !== opt),
                      }));
                    }
                  }}
                  className="accent-[#6BB1A0]"
                />
                <span className="text-sm text-[#36315B]">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // === CHECKBOX VERTICAL khusus untuk Pernyataan Umum & Sosialisasi - Pernyataan yang menggambarkan anak ===
  const CheckboxListVertical = ({ question }: { question: Q }) => (
    <div>
      <p className="font-medium text-sm mb-3 text-[#36315B]">{question.text}</p>
      <div className="space-y-2">
        {question.options?.map((opt) => (
          <label key={opt} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={answers[question.id]?.includes(opt) || false}
              onChange={(e) => {
                const old = answers[question.id] || [];
                if (e.target.checked) {
                  setAnswers((s) => ({ ...s, [question.id]: [...old, opt] }));
                } else {
                  setAnswers((s) => ({
                    ...s,
                    [question.id]: old.filter((x: string) => x !== opt),
                  }));
                }
              }}
              className="accent-[#6BB1A0]"
            />
            <span className="text-sm text-[#36315B]">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // === LIKERT 3 RADIO ===
  const Likert3Radio = ({ questions }: { questions: Q[] }) => {
    const opts = ["Tidak Pernah Sama Sekali", "Jarang", "Sering"];
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr className="text-[#36315B] font-semibold">
              <th>Pertanyaan</th>
              {opts.map((opt) => (
                <th key={opt} className="text-center">{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.id} className="border-b">
                <td className="py-2">{idx + 1}. {q.text}</td>
                {opts.map((opt) => (
                  <td key={opt} className="text-center py-2">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((s) => ({ ...s, [q.id]: opt }))}
                      className="text-[#6BB1A0]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // === SINGLE RADIO LIST ===
  const SingleRadioList = ({ question }: { question: Q }) => (
    <div>
      <p className="font-medium text-sm mb-3 text-[#36315B]">{question.text}</p>
      <div className="space-y-3">
        {question.options?.map((opt) => (
          <label
            key={opt}
            className="flex justify-between items-center border-b border-gray-200 py-3 cursor-pointer"
          >
            <span className="text-[#36315B]">{opt}</span>
            <input
              type="radio"
              name={question.id}
              value={opt}
              checked={answers[question.id] === opt}
              onChange={() => setAnswers((s) => ({ ...s, [question.id]: opt }))}
              className="accent-[#6BB1A0]"
            />
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />
      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="p-8">
          {/* STEP INDICATOR */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center cursor-pointer"
                  onClick={() => router.push(step.path)}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-[#36315B]">
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl mx-auto">
            <h4 className="text-base font-semibold text-[#36315B] mb-6">
              {activeIdx + 1}. {currentCategory.title}
            </h4>

            <form onSubmit={onSave} className="space-y-6">
              {currentCategory.type === "radio3" && (
                <Radio3Table questions={currentCategory.questions} />
              )}

              {currentCategory.type === "yes_only" && (
                <YesOnlyList questions={currentCategory.questions} />
              )}

              {(currentCategory.type === "likert" || currentCategory.type === "slider") && (
                <LikertSlider questions={currentCategory.questions} />
              )}

              {currentCategory.type === "checkbox" && currentCategory.id !== "behavior_social_statements" && (
                <CheckboxList questions={currentCategory.questions} />
              )}

              {currentCategory.id === "behavior_social_statements" && (
                <>
                  {currentCategory.questions
                    .filter((q) => q.id === "bs_1")
                    .map((question) => (
                      <CheckboxListVertical key={question.id} question={question} />
                    ))}

                  {currentCategory.questions
                    .filter((q) => q.id === "bermain_anak")
                    .map((question) => (
                      <SingleRadioList key={question.id} question={question} />
                    ))}
                </>
              )}

              {currentCategory.type === "likert5radio" && (
                <Likert3Radio questions={currentCategory.questions} />
              )}

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={activeIdx === 0}
                  className={`px-4 py-2 rounded-lg border ${
                    activeIdx === 0
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-[#36315B] border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Sebelumnya
                </button>

                {activeIdx < lastIndex ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-6 py-2 bg-[#6BB1A0] text-white rounded-lg hover:bg-[#58a88f]"
                  >
                    Lanjutkan
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#6BB1A0] text-white rounded-lg hover:bg-[#58a88f]"
                  >
                    Simpan
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
