"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { getAssessmentAnswers } from "@/lib/api/asesment";

type AnswerItem = {
  question_text: string;
  answer?: {
    value: any;
  };
  note?: string | null;
};

export default function RiwayatJawabanOkupasiPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = "okupasi";

  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        const res = await getAssessmentAnswers(assessmentId, type);
        setAnswers(res ?? []);
      } catch (e) {
        console.error("Gagal load riwayat:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat riwayat jawaban...
      </div>
    );
  }

  if (answers.length === 0) {
    return <div className="p-6">Tidak ada data riwayat.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 overflow-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/admin/jadwal_asesmen")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          <h2 className="text-lg font-semibold mb-4 px-3 py-2 bg-[#C0DCD6] rounded">
            Riwayat Jawaban Okupasi
          </h2>

          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-[#F3F7F6]">
                <th className="border p-2 w-[5%] text-center">No</th>
                <th className="border p-2 w-[45%] text-left">Pertanyaan</th>
                <th className="border p-2 w-[15%] text-center">Nilai</th>
                <th className="border p-2 w-[35%] text-left">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a, idx) => (
                <tr key={idx}>
                  <td className="border p-2 text-center">{idx + 1}</td>
                  <td className="border p-2">{a.question_text}</td>
                  <td className="border p-2 text-center">
                    {Array.isArray(a.answer?.value)
                      ? a.answer?.value.join(", ")
                      : a.answer?.value ?? "-"}
                  </td>
                  <td className="border p-2">{a.note ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
