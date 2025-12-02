"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import {
  getParentAssessmentQuestions,
  submitParentAssessment,
  ParentAssessmentType,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";

export default function TerapiWicaraPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await getParentAssessmentQuestions(
          "parent_wicara" as ParentAssessmentType
        );
        const questionsFromAPI = res.data.groups[0].questions;
        setQuestions(questionsFromAPI);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleChange = (id: number, value: any) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  const shouldShowQuestion = (q: any) => {
    if (!q.extra_schema) return true;
    const schema = typeof q.extra_schema === "string" ? JSON.parse(q.extra_schema) : q.extra_schema;
    if (!schema.conditional_rules) return true;
    return schema.conditional_rules.every((rule: any) => {
      const prevAnswer = answers[rule.when];
      if (!prevAnswer) return false;
      return prevAnswer === rule.value || prevAnswer.status === rule.value;
    });
  };

  const handleSubmit = async () => {
    if (!assessmentId) return alert("Assessment ID tidak ditemukan");

    try {
      setSubmitting(true);

      const payload = {
        answers: questions
          .filter((q) => shouldShowQuestion(q))
          .map((q) => {
            const ans = answers[q.id];

            if (!ans) return { question_code: q.question_code, answer: "" };

            // TABLE
            if (q.answer_type === "table") {
              const extraSchema = q.extra_schema ? JSON.parse(q.extra_schema) : {};
              const rows = extraSchema.rows || [];
              const columns = extraSchema.columns || [];
              return {
                question_code: q.question_code,
                answer: rows.map((row: string) => {
                  const rowAnswer: any = { row };
                  columns.forEach((col: string) => {
                    rowAnswer[col] = ans?.[row]?.[col] || "";
                  });
                  return rowAnswer;
                }),
              };
            }

            // RADIO (bisa ada field tambahan)
            if (q.answer_type === "radio") {
              if (ans && typeof ans === "object") {
                const combinedAnswer: { status?: any; [key: string]: any } = { status: ans.status };
                Object.keys(ans).forEach((key) => {
                  if (key !== "status") combinedAnswer[key] = ans[key];
                });
                return { question_code: q.question_code, answer: combinedAnswer };
              }
              return { question_code: q.question_code, answer: ans.status || ans };
            }

            // TEXT / TEXTAREA
            return { question_code: q.question_code, answer: ans };
          }),
      };

      await submitParentAssessment(assessmentId, "wicara_parent" as ParentSubmitType, payload);
      alert("Jawaban berhasil disimpan!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Gagal submit jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading pertanyaan...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <SidebarOrangtua />
      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />
        <main className="p-8 flex-1 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/orangtua/assessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          {/* STEPPER */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center cursor-pointer"
                  
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-[#36315B]">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className="w-10 h-px bg-gray-300 mx-2 translate-y-[-12px]" />}
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              {questions.map((q) => {
                if (!shouldShowQuestion(q)) return null;
                const extraSchema = q.extra_schema ? JSON.parse(q.extra_schema) : {};
                const radioOptions = extraSchema.options || (q.answer_options ? JSON.parse(q.answer_options) : []);
                const tableRows = extraSchema.rows || [];
                const tableColumns = extraSchema.columns || [];

                return (
                  <div key={q.id} className="mb-6">
                    <label className="block font-medium mb-2">{q.question_text}</label>

                    {/* TEXTAREA */}
                    {q.answer_type === "textarea" && (
                      <textarea
                        className="w-full border rounded-lg p-3 h-24"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                    )}

                    {/* TEXT */}
                    {q.answer_type === "text" && (
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                    )}

                    {/* RADIO */}
                    {q.answer_type === "radio" && (
                      <div className="flex gap-6 mt-2">
                        {radioOptions.map((op: string) => (
                          <label key={op} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={"q" + q.id}
                              value={op}
                              checked={answers[q.id]?.status === op}
                              onChange={() =>
                                handleChange(q.id, {
                                  ...answers[q.id],
                                  status: op,
                                })
                              }
                              className="accent-[#6BB1A0]"
                            />
                            {op}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* TABLE */}
                    {q.answer_type === "table" && (
                      <div className="space-y-3 mt-2">
                        {tableRows.map((row: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 border-b pb-2">
                            <span className="w-72">{row}</span>
                            {tableColumns.map((col: string) => (
                              <input
                                key={col}
                                type="text"
                                placeholder={col}
                                className="border rounded-lg p-2 flex-1"
                                value={answers[q.id]?.[row]?.[col] || ""}
                                onChange={(e) =>
                                  handleChange(q.id, {
                                    ...answers[q.id],
                                    [row]: { ...answers[q.id]?.[row], [col]: e.target.value },
                                  })
                                }
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="mt-8 bg-[#6BB1A0] text-white px-6 py-3 rounded-xl shadow-md w-full hover:bg-[#58a88f] transition disabled:opacity-50"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
