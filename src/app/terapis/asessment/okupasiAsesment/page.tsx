"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";

type Question = {
  id: number;
  question_code: string;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options: string | null;
  extra_schema?: string | null;
};

type Group = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

type UIAnswer = {
  score?: string;
  note?: string;
};

export default function OkupasiAssessmentPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") || "";

  const [groups, setGroups] = useState<Group[]>([]);
  const [answers, setAnswers] = useState<Record<string | number, UIAnswer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getAssessmentQuestions("okupasi");
        if (!data.groups || data.groups.length === 0) {
          setError("Data pertanyaan tidak tersedia");
          setGroups([]);
        } else {
          setGroups(data.groups);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat pertanyaan");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (
    questionId: number | string,
    field: "score" | "note",
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], [field]: value },
    }));
  };

  const handleNextGroup = () => {
    if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
    }
  };

  const handlePrevGroup = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers)
        .filter(([key]) => !isNaN(Number(key)))
        .map(([question_id, answer]) => ({
          question_id: Number(question_id),
          answer: { score: Number(answer.score), note: answer.note || "" },
        })),
      note: answers["note"]?.note || "",
      assessment_result: answers["assessment_result"]?.note || "",
      therapy_recommendation: answers["therapy_recommendation"]?.note
        ? answers["therapy_recommendation"]?.note.split(",")
        : [],
    };

    try {
      await submitAssessment(assessmentId, "okupasi", payload);
      alert("Berhasil submit assessment!");
    } catch (err) {
      console.error(err);
      alert("Gagal submit assessment");
    }
  };

  if (loading) return <div className="p-4">Loading pertanyaan...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (groups.length === 0) return null;

  const group = groups[currentGroupIndex];

  return (
    <div className="flex h-screen bg-gray-50 text-[#36315B]">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />
        <div className="p-6 overflow-auto">
           <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          {currentGroupIndex < groups.length - 1 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 px-2 py-1 bg-[#C0DCD6] rounded">
                {currentGroupIndex + 1}. {group.title}
              </h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-2 text-center w-[5%]">No</th>
                <th className="border px-3 py-2 text-left w-[43%]">Aspek</th>
                <th className="border px-3 py-2 text-center w-[15%]">Penilaian</th>
                <th className="border px-3 py-2 text-left w-[40%]">Keterangan</th>

                  </tr>
                </thead>
                <tbody>
                  {group.questions.map((q, idx) => {
                    const subAspects = q.question_text.split("|").map((line) => line.trim());
                    return subAspects.map((sub, subIdx) => {
                      const questionId = `${q.id}-${subIdx}`;
                      return (
                        <tr key={questionId} className="even:bg-gray-50">
                          <td className="border border-gray-300 p-2 text-center">
                            {subIdx === 0 ? `${idx + 1}` : String.fromCharCode(96 + subIdx)}.
                          </td>
                          <td className="border border-gray-300 p-2">{sub}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            <select
                              className="border rounded px-2 py-1 w-full"
                              value={answers[questionId]?.score || ""}
                              onChange={(e) =>
                                handleChange(questionId, "score", e.target.value)
                              }
                            >
                              <option value="">Pilih</option>
                              {[0, 1, 2, 3].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              placeholder="Keterangan"
                              className="border rounded px-2 py-1 w-full"
                              value={answers[questionId]?.note || ""}
                              onChange={(e) =>
                                handleChange(questionId, "note", e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Halaman terakhir */}
          {currentGroupIndex === groups.length - 1 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Catatan</h3>
              <textarea
                className="border rounded w-full p-2"
                placeholder="Masukkan catatan..."
                value={answers["note"]?.note || ""}
                onChange={(e) => handleChange("note", "note", e.target.value)}
              />

              <h3 className="text-md font-semibold mt-4 mb-2">Hasil Asesment</h3>
              <textarea
                className="border rounded w-full p-2"
                placeholder="Masukkan hasil asesment..."
                value={answers["assessment_result"]?.note || ""}
                onChange={(e) =>
                  handleChange("assessment_result", "note", e.target.value)
                }
              />

              <h3 className="text-md font-semibold mt-4 mb-2">Rekomendasi Terapi</h3>
              <div className="flex flex-col gap-2">
                {["PLB Paedagog", "Terapi Wicara", "Terapi Okupasi", "Fisioterapi"].map(
                  (therapy) => (
                    <label key={therapy} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          answers["therapy_recommendation"]?.note
                            ?.split(",")
                            .includes(therapy) || false
                        }
                        onChange={(e) => {
                          const current = answers["therapy_recommendation"]?.note
                            ? answers["therapy_recommendation"].note.split(",")
                            : [];
                          let updated: string[];
                          if (e.target.checked) {
                            updated = [...current, therapy];
                          } else {
                            updated = current.filter((t) => t !== therapy);
                          }
                          handleChange(
                            "therapy_recommendation",
                            "note",
                            updated.join(",")
                          );
                        }}
                      />
                      {therapy}
                    </label>
                  )
                )}
              </div>
            </div>
          )}

          {/* Navigasi */}
          <div className="flex justify-between mt-4">
            {currentGroupIndex > 0 && (
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={handlePrevGroup}
              >
                Sebelumnya
              </button>
            )}
            {currentGroupIndex < groups.length - 1 ? (
              <button
                className="bg-[#81B7A9] text-white px-4 py-2 rounded ml-auto"
                onClick={handleNextGroup}
              >
                Lanjutkan
              </button>
            ) : (
              <button
                className="bg-[#81B7A9] text-white px-4 py-2 rounded ml-auto"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
