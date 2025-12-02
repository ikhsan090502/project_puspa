"use client";

import React, { useEffect, useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getParentAssessmentQuestions,
  submitParentAssessment,
  ParentAssessmentType,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";

type Question = {
  id: number;
  question_code: string;
  question_number: string;
  question_text: string;
  answer_type: "radio" | "text";
  answer_options?: string[];
};

type Group = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

type Step = { label: string; path: string };

export default function PaedagogFormPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const steps: Step[] = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  // Step aktif hanya Paedagog
  const activeStep = steps.findIndex((step) => step.path.includes("/paedagog"));

  const [groups, setGroups] = useState<Group[]>([]);
  const [answers, setAnswers] = useState<Record<string, Record<number, any>>>({});
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch pertanyaan
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!assessmentId) {
        alert("Assessment ID tidak ditemukan");
        return;
      }
      try {
        const res = await getParentAssessmentQuestions("parent_paedagog" as ParentAssessmentType);

        const dataGroups: Group[] = res.data.groups.map((g: any) => ({
          group_id: g.group_id,
          group_key: g.group_key,
          title: g.title,
          questions: g.questions.map((q: any) => ({
            id: q.id,
            question_code: q.question_code,
            question_number: q.question_number,
            question_text: q.question_text,
            answer_type: q.answer_type,
            answer_options: q.extra_schema ? JSON.parse(q.answer_options ?? "[]") : [],
          })),
        }));

        setGroups(dataGroups);

        const initAnswers: Record<string, Record<number, any>> = {};
        dataGroups.forEach((g) => {
          initAnswers[g.group_key] = {};
          g.questions.forEach((q) => {
            initAnswers[g.group_key][q.id] = "";
          });
        });

        setAnswers(initAnswers);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil pertanyaan");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [assessmentId]);

  const handleChange = (groupKey: string, questionId: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [questionId]: value,
      },
    }));
  };

  const handleNextGroup = () => {
    if (currentStep < groups.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePreviousGroup = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSave = async () => {
    if (!assessmentId) {
      alert("Assessment ID tidak ditemukan");
      return;
    }

    try {
      // Format jawaban sesuai backend [{ question_id, answer }]
      const formattedAnswers = Object.values(answers)
        .flatMap((group) =>
          Object.entries(group).map(([questionId, answer]) => ({
            question_id: Number(questionId),
            answer,
          }))
        );

      await submitParentAssessment(assessmentId, "paedagog_parent" as ParentSubmitType, {
        answers: formattedAnswers,
      });

      alert("Jawaban berhasil disimpan");
      router.push("/orangtua/assessment");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal submit jawaban");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (groups.length === 0) return <p>Tidak ada pertanyaan.</p>;

  const group = groups[currentStep];

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/orangtua/assessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          {/* STEP-PROGRESS BAR (TIDAK BISA DIKLIK, HANYA PAEDAGOG AKTIF) */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
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

                    <span
                      className={`text-sm font-medium ${
                        i === activeStep ? "text-[#36315B]" : "text-gray-500"
                      }`}
                    >
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

          {/* Card Pertanyaan */}
          <div className="bg-white rounded-xl p-5 shadow mb-6">
            <h2 className="font-semibold text-lg mb-3">{group.title}</h2>

            <div className="space-y-4">
              {group.questions.map((q) => (
                <div key={q.id} className="bg-gray-50 p-2 rounded-lg">
                  <label className="block mb-1 font-medium">
                    {q.question_number}. {q.question_text}
                  </label>

                  {q.answer_type === "radio" ? (
                    <div className="flex gap-4">
                      {q.answer_options?.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={`${group.group_key}-${q.id}`}
                            checked={answers[group.group_key]?.[q.id] === opt}
                            onChange={() => handleChange(group.group_key, q.id, opt)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full border px-3 py-2 rounded"
                      value={answers[group.group_key]?.[q.id] ?? ""}
                      onChange={(e) => handleChange(group.group_key, q.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousGroup}
              disabled={currentStep === 0}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Sebelumnya
            </button>

            {currentStep < groups.length - 1 ? (
              <button
                onClick={handleNextGroup}
                className="px-6 py-2 bg-[#81B7A9] text-white rounded-lg"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={onSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                Simpan Jawaban
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Aspek {currentStep + 1} dari {groups.length}
          </p>
        </main>
      </div>
    </div>
  );
}
