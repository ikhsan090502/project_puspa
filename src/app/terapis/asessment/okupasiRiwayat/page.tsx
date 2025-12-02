"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { getAssessmentAnswers } from "@/lib/api/asesment";
import { ChevronDown } from "lucide-react";

export default function RiwayatJawabanOkupasiPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = "okupasi";

  const [answers, setAnswers] = useState<any>(null);
  const [sections, setSections] = useState<string[]>([]);

  const [reportNotes, setReportNotes] = useState("");
  const [reportResult, setReportResult] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ===========================
        FETCH API OKUPASI
     =========================== */
  useEffect(() => {
    const fetchData = async () => {
      if (!assessmentId) return setLoading(false);

      try {
        const response = await getAssessmentAnswers(assessmentId, type);
        if (!response) return;

        setReportNotes(response.note || "");
        setReportResult(response.assessment_result || "");

        const rec = response.therapy_recommendation ?? "";
        setRecommendation(Array.isArray(rec) ? rec.join(", ") : rec);

        setAnswers(response);

        const keys = Object.keys(response).filter(
          (k) =>
            ![
              "note",
              "assessment_result",
              "therapy_recommendation",
              "child_name",
              "child_id",
            ].includes(k)
        );
        setSections(keys);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  const isSummary = stepIndex >= sections.length;
  const currentSection = !isSummary ? sections[stepIndex] : null;

  /* ===========================
        A/B/C/D Prefix Function
     =========================== */
  const getLetterPrefix = (index: number) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[index]
      ? `${alphabet[index]}.`
      : `${index + 1}.`;
  };

  /* ===========================
        CEK SECTION COMPLETE
     =========================== */
  const isSectionComplete = (section: string) => {
    const data = answers?.[section] ?? [];
    if (!Array.isArray(data)) return false;
    return data.every((q) => q.answer_value !== null && q.answer_value !== "");
  };

  /* ===========================
        SECTION CARD
     =========================== */
  const SectionCard: React.FC<{ title: string }> = ({ title }) => {
    const items = answers?.[currentSection!] || [];

    return (
      <div className="flex flex-col flex-1 bg-gray-50">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => (window.location.href = "/terapis/asessment")}
            className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
          >
            ✕
          </button>
        </div>

        {/* HEADER */}
        <div
          className={`w-full flex items-center justify-between px-6 py-4 rounded-t-xl shadow-sm ${
            isSectionComplete(currentSection!)
              ? "bg-[#36315B] text-white"
              : "bg-[#F3F7F6] text-[#36315B]"
          }`}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <ChevronDown className="w-5 h-5" />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-lg rounded-b-xl p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F3F7F6] text-[#36315B]">
                <th className="border px-3 py-2 text-center w-[5%]">No</th>
                <th className="border px-3 py-2 text-left w-[43%]">Aspek</th>
                <th className="border px-3 py-2 text-center w-[15%]">Penilaian</th>
                <th className="border px-3 py-2 text-left w-[40%]">Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Tidak ada pertanyaan.
                  </td>
                </tr>
              )}

              {items.map((q: any, index: number) => {
                let parsed: any = {};
                try {
                  parsed = q.answer_value ? JSON.parse(q.answer_value) : {};
                } catch {
                  parsed = {};
                }

                return (
                  <tr key={index} className="border">
                    <td className="border px-3 py-2 text-center">{index + 1}</td>
                    <td className="border px-3 py-2">{q.question_text}</td>

                    <td className="border px-3 py-2 text-center">
                      <select
                        disabled
                        value={parsed.score ?? ""}
                        className="w-full border bg-gray-200 text-gray-600 rounded-lg py-2 px-2 text-sm"
                      >
                        <option value="">Pilih</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </td>

                    <td className="border px-3 py-2">
                      <input
                        readOnly
                        value={parsed.note ?? ""}
                        className="w-full border bg-gray-100 text-gray-700 rounded-lg py-2 px-3 text-sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ===========================
        SUMMARY
     =========================== */
  const SummaryCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold text-center mb-6">
        Laporan Assessment Terapi Okupasi
      </h3>

      <label className="font-medium mb-1 block">Catatan</label>
      <textarea
        readOnly
        value={reportNotes}
        rows={4}
        className="w-full border rounded-lg p-3 bg-gray-100 mb-4"
      />

      <label className="font-medium mb-1 block">Hasil Assessment</label>
      <textarea
        readOnly
        value={reportResult}
        rows={4}
        className="w-full border rounded-lg p-3 bg-gray-100 mb-4"
      />

      <label className="font-medium mb-2 block">Rekomendasi Terapi</label>
      <div className="flex flex-wrap gap-6 text-gray-600">
        {[
          "PLB (Paedagog)",
          "Terapi Okupasi",
          "Terapi Wicara",
          "Fisioterapi",
        ].map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input type="radio" disabled checked={recommendation === opt} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (loading || !answers) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#36315B] font-medium">
        Memuat riwayat jawaban...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />

      <div className="flex-1">
        <HeaderTerapis />

        <div className="p-6">
          {!isSummary && currentSection ? (
            <SectionCard
              title={`${getLetterPrefix(stepIndex)} ${currentSection}`}
            />
          ) : (
            <SummaryCard />
          )}

          {/* NAVIGASI */}
          <div className="flex justify-between items-center mt-6">
            {stepIndex > 0 ? (
              <button
                onClick={() => setStepIndex((s) => s - 1)}
                className="px-5 py-2 bg-white border rounded-lg shadow-sm text-[#36315B]"
              >
                Sebelumnya
              </button>
            ) : (
              <div></div>
            )}

            {!isSummary ? (
              <button
                onClick={() => setStepIndex((s) => s + 1)}
                className="px-6 py-2 rounded-lg text-white"
                style={{ backgroundColor: "#81B7A9" }}
              >
                Lanjutkan
              </button>
            ) : (
              <div className="text-gray-400 font-medium text-sm">
                (Akhir Riwayat)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
