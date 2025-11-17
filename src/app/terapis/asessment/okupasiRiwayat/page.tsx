"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import questionsData from "@/data/okupasi.json";
import { ChevronDown } from "lucide-react";
import { getAssessmentAnswers } from "@/lib/api/asesment";

type SubKey = string;

export default function RiwayatJawabanOkupasiPage() {
  const sectionKeys = useMemo(() => Object.keys(questionsData), []);

  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = "okupasi"; // 🔥 sesuai permintaan

  const [answers, setAnswers] = useState<
    Record<SubKey, { score?: string; note?: string }>
  >({});

  const [reportNotes, setReportNotes] = useState("");
  const [reportResult, setReportResult] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentSectionKey =
    stepIndex < sectionKeys.length ? sectionKeys[stepIndex] : null;
  const isSummary = stepIndex >= sectionKeys.length;

  const goNext = () => {
    if (!isSummary) setStepIndex((s) => Math.min(s + 1, sectionKeys.length));
  };

  const goPrev = () => {
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  /* ============================
      FETCH API OKUPASI
     ============================ */
  useEffect(() => {
    const fetchData = async () => {
      if (!assessmentId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAssessmentAnswers(assessmentId, type);
        if (!response) return;

        const formatted: Record<string, { score?: string; note?: string }> = {};

        Object.entries(response).forEach(([key, value]) => {
          const matchScore = key.match(/^(.+?)_(\d+)_score$/);
          const matchDesc = key.match(/^(.+?)_(\d+)_desc$/);

          if (matchScore) {
            const section = matchScore[1].replace(/_/g, "");
            const index = Number(matchScore[2]);
            const finalKey = `${section}-${index}`;

            if (!formatted[finalKey]) formatted[finalKey] = {};
            formatted[finalKey].score = String(value);
          }

          if (matchDesc) {
            const section = matchDesc[1].replace(/_/g, "");
            const index = Number(matchDesc[2]);
            const finalKey = `${section}-${index}`;

            if (!formatted[finalKey]) formatted[finalKey] = {};
            formatted[finalKey].note = String(value);
          }

          if (key === "report_notes") setReportNotes(String(value));
          if (key === "report_result") setReportResult(String(value));
          if (key === "recommendation") setRecommendation(String(value));
        });

        setAnswers(formatted);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, type]);

  /* ============================
        SECTION CARD - UI SAMA
     ============================ */
  const SectionCard: React.FC<{ sectionId: string }> = ({ sectionId }) => {
    const section = (questionsData as any)[sectionId];

    return (
      <div className="flex flex-col flex-1 bg-gray-50">

        {/* Header - kecil & rounded */}
        <div className="w-full flex items-center justify-between px-4 py-3 bg-[#36315B] text-white rounded-t-xl shadow-sm">
          <h3 className="text-base font-semibold">
            {sectionId}. {section.title}
          </h3>
          <ChevronDown className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {section.items.map((item: any) => (
            <div key={item.no} className="bg-white rounded-xl shadow-lg p-5">
              <div className="font-bold mb-2 text-[#36315B] text-sm">
                {item.no}. {item.aspect}
              </div>

              {item.sub.map((s: string, si: number) => {
                const dataKey = `${sectionId}${item.no}-${si}`;
                const ans = answers[dataKey] || {};

                return (
                  <div key={si} className="grid grid-cols-12 gap-3 items-start mb-4">
                    <div className="col-span-1 text-sm">
                      {String.fromCharCode(97 + si)}.
                    </div>

                    <div className="col-span-5 text-sm leading-5">{s}</div>

                    <div className="col-span-2">
                      <select
                        disabled
                        value={ans?.score || ""}
                        className="w-full border bg-gray-200 text-gray-600 rounded-lg py-2 px-3 text-sm cursor-not-allowed"
                      >
                        <option value="">Penilaian</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="2">3</option>
                      </select>
                    </div>

                    <div className="col-span-4">
                      <input
                        readOnly
                        value={ans?.note || ""}
                        placeholder="Keterangan"
                        className="w-full border bg-gray-100 text-gray-700 rounded-lg py-2 px-3 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed mb-4"
      />

      <label className="font-medium mb-1 block">Hasil Assessment</label>
      <textarea
        readOnly
        value={reportResult}
        rows={4}
        className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed mb-4"
      />

      <label className="font-medium mb-2 block">Rekomendasi Terapi</label>
      <div className="flex flex-wrap gap-6 text-gray-600">
        {["PLB (Paedagog)", "Terapi Okupasi", "Terapi Wicara", "Fisioterapi"].map(
          (opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" disabled checked={recommendation === opt} />
              <span>{opt}</span>
            </label>
          )
        )}
      </div>
    </div>
  );

  if (loading) {
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
          {/* Section Card */}
          <div className="space-y-6">
            {!isSummary && currentSectionKey ? (
              <SectionCard sectionId={currentSectionKey} />
            ) : (
              <SummaryCard />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <div>
              {stepIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="px-5 py-2 bg-white border rounded-lg shadow-sm text-[#36315B]"
                >
                  Sebelumnya
                </button>
              )}
            </div>

            <div>
              {!isSummary ? (
                <button
                  onClick={goNext}
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
    </div>
  );
}
