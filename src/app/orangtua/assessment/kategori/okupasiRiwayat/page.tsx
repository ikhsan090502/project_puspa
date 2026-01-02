"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";
import { getParentAssessmentQuestions, ParentAssessmentType } from "@/lib/api/asesmentTerapiOrtu";

// =====================
// TYPE
// =====================
type Q = { id: string; text: string; type?: string; options?: string[]; };
type Category = { id: string; title: string; type: string; questions: Q[]; };

function tryParseMaybeJson(v: any) {
  if (v === null || v === undefined) return undefined;
  if (Array.isArray(v) || typeof v === "object") return v;
  if (typeof v === "number") return v;
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
}

export default function DataTerapiOkupasiPageReadOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") || null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const lastIndex = categories.length - 1;
  const steps = [
    { label: "Data Umum" },
    { label: "Data Fisioterapi" },
    { label: "Data Terapi Okupasi" },
    { label: "Data Terapi Wicara" },
    { label: "Data Paedagog" },
  ];
  const activeStep = 2;

  useEffect(() => {
    const fetchAll = async () => {
      if (!assessmentId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const qRes = await getParentAssessmentQuestions("parent_okupasi" as ParentAssessmentType);
        const groups = qRes?.data?.groups ?? [];
        const aRes = await getParentAssessmentAnswers(assessmentId, "okupasi_parent" as ParentSubmitType);
        const list = aRes?.data ?? [];
        const fetchedAnswers: Record<string, any> = {};
        list.forEach((item: any) => {
          fetchedAnswers[String(item.question_id)] = item?.answer?.value !== undefined ? tryParseMaybeJson(item.answer.value) : null;
        });

        const builtCategories: Category[] = groups.map((g: any) => {
          const answerTypes = g.questions.map((q: any) => q.answer_type);
          let categoryType = "radio3";
          if (answerTypes.every((t: string) => t === "slider")) categoryType = "slider";
          else if (answerTypes.every((t: string) => t === "yes_only")) categoryType = "yes_only";
          else if (answerTypes.every((t: string) => t === "checkbox")) categoryType = "checkbox";
          return {
            id: String(g.group_id),
            title: g.title,
            type: categoryType,
            questions: g.questions.map((q: any) => ({
              id: String(q.id),
              text: q.question_text,
              type: q.answer_type,
              options: q.answer_options ?? [],
            })),
          };
        });

        setCategories(builtCategories);
        setAnswers(fetchedAnswers);
      } catch (err) {
        console.error("❌ ERROR fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [assessmentId]);

  const currentCategory = categories[activeIdx];
  const goNext = () => { if (activeIdx < lastIndex) setActiveIdx((i) => i + 1); };
  const goPrev = () => { if (activeIdx > 0) setActiveIdx((i) => i - 1); };

  const inputClass = "appearance-none w-5 h-5 rounded border border-gray-400 checked:bg-[#6BB1A0] disabled:checked:bg-[#6BB1A0] checked:border-[#6BB1A0] relative before:content-['✔'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:text-sm";
  const radioClass = "appearance-none w-5 h-5 rounded-full border border-gray-400 checked:bg-[#6BB1A0] disabled:checked:bg-[#6BB1A0] checked:border-[#6BB1A0] relative before:content-['✔'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:text-sm";

  const Radio3Table = ({ questions }: { questions: Q[] }) => {
    const opts = ["Ya", "Tidak", "Kadang-kadang"];
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-base border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#36315B] font-semibold">
              <th className="text-left w-[55%]">Pertanyaan</th>
              {opts.map((opt) => (<th key={opt} className="text-center w-[15%]">{opt}</th>))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => {
              const val = answers[q.id];
              return (
                <tr key={q.id} className="border-b border-gray-200">
                  <td className="py-3 text-base text-[#36315B]">{idx + 1}. {q.text}</td>
                  {opts.map((opt) => (
                    <td key={opt} className="text-center py-3">
                      <input type="radio" checked={val === opt} readOnly disabled className={radioClass} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const YesOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={q.id} className="flex justify-between border-b pb-3">
          <span className="text-base text-[#36315B]">{i + 1}. {q.text}</span>
          <input type="checkbox" checked={answers[q.id] === "Ya" || answers[q.id] === true} readOnly disabled className={inputClass} />
        </div>
      ))}
    </div>
  );

  const SliderReadOnlyList = ({ questions }: { questions: Q[] }) => (
  <div className="space-y-6">
    {questions.map((q, i) => {
      const value =
        typeof answers[q.id] === "number"
          ? Number(answers[q.id])
          : 1; // default 1

      return (
        <div key={q.id} className="border-b pb-4">
          <p className="text-base text-[#36315B] mb-3">
            {i + 1}. {q.text}
          </p>

          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={value}
            readOnly
            className="w-full accent-[#6BB1A0]"
          />

          {/* Skala angka di bawah slider */}
          <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      );
    })}
  </div>
);


  const CheckboxReadOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-8">
      {questions.map((q, i) => {
        const selectedValues: string[] = Array.isArray(answers[q.id]) ? answers[q.id] : [];
        return (
          <div key={q.id} className="space-y-3">
            <p className="text-base font-medium text-[#36315B]">{i + 1}. {q.text}</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {q.options?.map((opt) => (
                <label key={opt} className="flex items-center gap-3 text-[#36315B]">
                  <input type="checkbox" checked={selectedValues.includes(opt)} readOnly disabled className={inputClass} />
                  <span className="text-base">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) return <div className="p-10">Memuat data...</div>;
  if (!currentCategory) return <div className="p-10">Tidak ada data</div>;

  return (
    <ResponsiveOrangtuaLayout>
      <div className="bg-white rounded-2xl p-4 md:p-8 max-w-5xl mx-auto relative mt-5">
        <div className="flex justify-end mb-4">
          <button onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)} className="text-[#36315B] hover:text-red-500 font-bold text-2xl">✕</button>
        </div>

        {/* Stepper */}
        <div className="flex flex-wrap justify-center mb-6 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-wrap gap-2">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${i === activeStep ? "bg-[#6BB1A0] border-[#6BB1A0] text-white" : "bg-gray-100 border-gray-300 text-gray-500"}`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium ${i === activeStep ? "text-[#36315B]" : "text-gray-500"}`}>{step.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-6 md:w-12 h-px bg-gray-300 mx-1 md:mx-2 hidden md:block translate-y-[-12px]" />}
            </div>
          ))}
        </div>

        <h4 className="font-semibold mb-6">{activeIdx + 1}. {currentCategory.title}</h4>

        {currentCategory.type === "yes_only" && <YesOnlyList questions={currentCategory.questions} />}
        {currentCategory.type === "radio3" && <Radio3Table questions={currentCategory.questions} />}
        {currentCategory.type === "slider" && <SliderReadOnlyList questions={currentCategory.questions} />}
        {currentCategory.type === "checkbox" && <CheckboxReadOnlyList questions={currentCategory.questions} />}

        <div className="flex flex-col md:flex-row justify-between mt-8 gap-3">
          <button onClick={goPrev} disabled={activeIdx === 0} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 w-full md:w-auto">Sebelumnya</button>
          <button onClick={goNext} disabled={activeIdx === lastIndex} className="px-6 py-2 rounded-lg bg-[#6BB1A0] text-white font-medium hover:bg-[#5aa391] disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto">Lanjutkan</button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
