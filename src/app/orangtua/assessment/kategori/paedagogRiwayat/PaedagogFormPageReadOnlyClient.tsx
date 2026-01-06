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
  aspect_key: string;
  section_key: string;
};

type Aspect = {
  key: string;
  label: string;
};

/* ===================== PAGE ===================== */
export default function PaedagogFormPageReadOnlyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;

  const submitType: ParentSubmitType = "paedagog_parent";
  const questionType: ParentAssessmentType = "parent_paedagog";

  /* ===== STATE ===== */
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  /* ===== STEPPER GLOBAL ===== */
  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 4;

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        /* Ambil struktur pertanyaan */
        const qRes = await getParentAssessmentQuestions(questionType);
        const groups = qRes?.data?.groups || [];

        const aspectList: Aspect[] = groups.map((g: any) => ({
          key: g.group_key,
          label: g.title,
        }));

        /* Ambil jawaban */
        const aRes = await getParentAssessmentAnswers(assessmentId, submitType);
        const apiAnswers = aRes?.data || [];

        /* Merge jawaban + aspek */
        const merged: AnswerItem[] = apiAnswers.map((item: any) => {
          let aspect_key = "default";
          let section_key = "Lainnya";

          for (const g of groups) {
            const found = g.questions.find(
              (q: any) => String(q.id) === String(item.question_id)
            );
            if (found) {
              aspect_key = g.group_key;
              section_key = g.title;
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
        setAnswers(merged);
        setActiveIdx(0);
      } catch (err) {
        console.error("❌ Gagal load riwayat paedagog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ===================== DATA AKTIF ===================== */
  const activeAspect = aspects[activeIdx];
  const activeQuestions = answers.filter(
    (q) => q.aspect_key === activeAspect?.key
  );

  const groupedBySection: Record<string, AnswerItem[]> = {};
  activeQuestions.forEach((q) => {
    if (!groupedBySection[q.section_key]) {
      groupedBySection[q.section_key] = [];
    }
    groupedBySection[q.section_key].push(q);
  });

  /* ===================== RENDER ===================== */
  if (loading) {
    return (
      <ResponsiveOrangtuaLayout>
        <div className="p-10 text-center text-lg font-medium text-[#36315B]">
          Memuat riwayat Paedagog...
        </div>
      </ResponsiveOrangtuaLayout>
    );
  }

  if (!activeAspect) {
    return (
      <ResponsiveOrangtuaLayout>
        <div className="p-10 text-center text-gray-500">
          Tidak ada data Paedagog.
        </div>
      </ResponsiveOrangtuaLayout>
    );
  }

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

        {/* ===== STEPPER GLOBAL ===== */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  i === activeStep
                    ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm ${
                  i === activeStep
                    ? "font-semibold text-[#36315B]"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
              {i < steps.length - 1 && (
                <div className="w-6 md:w-12 h-px bg-gray-300 hidden md:block translate-y-[-10px]" />
              )}
            </div>
          ))}
        </div>

        {/* ===== STEPPER ASPEK ===== */}
        <div className="flex flex-wrap justify-center mb-6 gap-4">
          {aspects.map((asp, i) => (
            <div key={asp.key} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  i === activeIdx
                    ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm ${
                  i === activeIdx
                    ? "font-semibold text-[#36315B]"
                    : "text-gray-500"
                }`}
              >
                {asp.label}
              </span>
              {i < aspects.length - 1 && (
                <div className="w-6 md:w-12 h-px bg-gray-300 hidden md:block translate-y-[-10px]" />
              )}
            </div>
          ))}
        </div>

        {/* ===== CARD ===== */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow space-y-6">
          {Object.keys(groupedBySection).map((section) => (
            <div key={section}>
              <h3 className="font-semibold mb-3">{section}</h3>

              <div className="space-y-3">
                {groupedBySection[section].map((q, i) => (
                  <div
                    key={q.question_id}
                    className="bg-gray-50 p-3 rounded-lg"
                  >
                    <p className="font-medium mb-1">
                      {i + 1}. {q.question_text}
                    </p>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={q.answer_value ?? "-"}
                      className="w-full border rounded px-3 py-2 bg-white"
                    />
                    {q.note && (
                      <p className="mt-1 text-sm text-gray-500">
                        Catatan: {q.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ===== NAVIGASI ASPEK ===== */}
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-3">
          <button
            onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
            disabled={activeIdx === 0}
            className={`px-5 py-2 rounded-lg font-medium border ${
              activeIdx === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#36315B] hover:bg-gray-100"
            }`}
          >
            ← Sebelumnya
          </button>

          <button
            onClick={() =>
              setActiveIdx((i) => Math.min(i + 1, aspects.length - 1))
            }
            disabled={activeIdx === aspects.length - 1}
            className={`px-5 py-2 rounded-lg font-medium ${
              activeIdx === aspects.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#6BB1A0] text-white hover:opacity-90"
            }`}
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
