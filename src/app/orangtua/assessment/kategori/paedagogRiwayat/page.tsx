"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getParentAssessmentAnswers,
  ParentSubmitType,
  getParentAssessmentQuestions,
  ParentAssessmentType,
} from "@/lib/api/asesmentTerapiOrtu";

/* ===================== TYPES ===================== */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer_value: string | null;
  note: string | null;
  section_key: string;
  aspect_key: string;
};

type Aspect = { key: string; label: string; };

export default function PaedagogFormPageReadOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;

  const submitType: ParentSubmitType = "paedagog_parent";
  const questionType: ParentAssessmentType = "parent_paedagog";

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [activeAspectKey, setActiveAspectKey] = useState("");

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 4;

  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const questionRes = await getParentAssessmentQuestions(questionType);
        const groups = questionRes?.data?.groups || [];
        const aspectList: Aspect[] = groups.map((g: any) => ({
          key: g.group_key,
          label: g.title,
        }));

        const answerRes = await getParentAssessmentAnswers(assessmentId, submitType);
        const apiAnswers = answerRes?.data || [];

        const mergedAnswers: AnswerItem[] = apiAnswers.map((item: any) => {
          let aspect_key = "default";
          let section_key = "Lainnya";

          for (const group of groups) {
            const found = group.questions.find(
              (q: any) => String(q.id) === String(item.question_id)
            );
            if (found) {
              aspect_key = group.group_key;
              section_key = group.title;
              break;
            }
          }

          return {
            question_id: String(item.question_id),
            question_text: item.question_text,
            answer_value: item.answer?.value ?? null,
            note: item.note ?? null,
            aspect_key,
            section_key,
          };
        });

        setAspects(aspectList);
        setAnswers(mergedAnswers);
        setActiveAspectKey(aspectList[0]?.key || "default");
      } catch (error) {
        console.error("❌ Gagal load riwayat paedagog parent", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  const activeQuestions = answers.filter((q) => q.aspect_key === activeAspectKey);

  const sectionGroups: Record<string, AnswerItem[]> = {};
  activeQuestions.forEach((q) => {
    if (!sectionGroups[q.section_key]) sectionGroups[q.section_key] = [];
    sectionGroups[q.section_key].push(q);
  });

  const currentIndex = aspects.findIndex((a) => a.key === activeAspectKey);
  const handlePrevAspect = () => {
    if (currentIndex > 0) {
      setActiveAspectKey(aspects[currentIndex - 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleNextAspect = () => {
    if (currentIndex < aspects.length - 1) {
      setActiveAspectKey(aspects[currentIndex + 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <div className="p-10 text-center text-lg font-medium text-[#36315B]">Memuat jawaban...</div>;

  return (
    <ResponsiveOrangtuaLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* CLOSE */}
        <div className="flex justify-end mb-4">
          <button
  onClick={() =>
    router.push(
      `/orangtua/assessment/kategori?assessment_id=${assessmentId}`
    )
  }
  className="font-bold text-2xl hover:text-red-500"
>
  ✕
</button>

        </div>

        {/* STEP PROGRESS */}
        <div className="flex flex-wrap justify-center mb-6 gap-4">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            return (
              <div key={i} className="flex items-start flex-wrap gap-2">
                <div className="flex flex-col items-center min-w-[70px]">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${isActive ? "bg-[#6BB1A0] border-[#6BB1A0] text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                    {i + 1}
                  </div>
                  <span className={`mt-2 text-sm text-center ${isActive ? "font-semibold text-[#36315B]" : "text-gray-400"}`}>{step}</span>
                </div>
                {i < steps.length - 1 && <div className="w-6 md:w-14 h-px bg-gray-300 mt-4" />}
              </div>
            );
          })}
        </div>

        {/* ASPEK DROPDOWN */}
        <div className="mb-6 flex justify-end">
          <select
            value={activeAspectKey}
            onChange={(e) => setActiveAspectKey(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-64"
          >
            {aspects.map((asp) => <option key={asp.key} value={asp.key}>{asp.label}</option>)}
          </select>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow space-y-6">
          {Object.keys(sectionGroups).map((section) => (
            <div key={section}>
              <h3 className="font-semibold mb-3">{section}</h3>
              <div className="space-y-3">
                {sectionGroups[section].map((q, i) => (
                  <div key={q.question_id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">{i + 1}. {q.question_text}</p>
                    <input type="text" value={q.answer_value ?? "-"} readOnly disabled className="w-full border rounded px-3 py-2 bg-white" />
                    {q.note && <p className="mt-1 text-sm text-gray-500">Catatan: {q.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGASI ASPEK */}
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-3">
          <button onClick={handlePrevAspect} disabled={currentIndex === 0} className={`px-5 py-2 rounded-lg font-medium border w-full md:w-auto ${currentIndex === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#36315B] hover:bg-gray-100"}`}>← Sebelumnya</button>
          <button onClick={handleNextAspect} disabled={currentIndex === aspects.length - 1} className={`px-5 py-2 rounded-lg font-medium w-full md:w-auto ${currentIndex === aspects.length - 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#6BB1A0] text-white hover:opacity-90"}`}>Selanjutnya →</button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
