"use client";

import React, { useMemo, useState } from "react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import questionsData from "@/data/okupasi.json";
import { ChevronDown } from "lucide-react";

type SubKey = string;

export default function Page() {
  const sectionKeys = useMemo(() => Object.keys(questionsData), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<SubKey, { score?: string; note?: string }>>({});
  const [reportNotes, setReportNotes] = useState("");
  const [reportResult, setReportResult] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const currentSectionKey = stepIndex < sectionKeys.length ? sectionKeys[stepIndex] : null;
  const isSummary = stepIndex >= sectionKeys.length;

  const setAnswer = (key: SubKey, field: "score" | "note", value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: value },
    }));
  };

  const isSectionComplete = (sectionId: string) => {
    const section = (questionsData as any)[sectionId];
    if (!section) return false;

    for (const item of section.items) {
      for (let si = 0; si < item.sub.length; si++) {
        const key = `${sectionId}-${item.no}-${si}`;
        if (!answers[key] || !answers[key].score) return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (isSummary) return;
    setStepIndex((s) => Math.min(s + 1, sectionKeys.length));
  };
  const goPrev = () => {
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  const handleSave = () => {
    const payload = {
      answers,
      reportNotes,
      reportResult,
      recommendation,
    };
    console.log("Simpan payload:", payload);
    alert("Data disimpan (lihat console).");
  };

  const SectionCard: React.FC<{ sectionId: string }> = ({ sectionId }) => {
    const section = (questionsData as any)[sectionId];
    return (
      <div className="flex flex-col flex-1 bg-gray-50">
        {/* Header */}
        <div
          className={`w-full flex items-center justify-between px-6 py-4 ${
            isSectionComplete(sectionId)
              ? "bg-[#36315B] text-white"
              : "bg-[#F3F7F6] text-[#36315B]"
          }`}
        >
          <h3 className="text-lg font-semibold">
            {sectionId}. {section.title}
          </h3>
          <ChevronDown className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {section.items.map((item: any) => (
            <div
              key={item.no}
              className="bg-white rounded-xl shadow-lg p-5"
            >
              <div className="font-bold mb-2 text-[#36315B] text-sm">
                {item.no}. {item.aspect}
              </div>

              {item.sub.map((s: string, si: number) => {
                const key = `${sectionId}-${item.no}-${si}`;
                return (
                  <div key={si} className="grid grid-cols-12 gap-3 items-start mb-4">
                    {/* Label a/b/c */}
                    <div className="col-span-1 text-sm">{String.fromCharCode(97 + si)}.</div>

                    {/* Sub description */}
                    <div className="col-span-5 text-sm leading-5">{s}</div>

                    
                    <div className="col-span-2">
                      <select
                        value={answers[key]?.score || ""}
                        onChange={(e) => setAnswer(key, "score", e.target.value)}
                        className="w-full border rounded-lg py-2 px-3 text-sm select-penilaian 
             hover:border-[#81B7A9] hover:ring-2 hover:ring-[#81B7A9]"
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
                        value={answers[key]?.note || ""}
                        onChange={(e) => setAnswer(key, "note", e.target.value)}
                        placeholder="Keterangan"
                        className="w-full border rounded-lg py-2 px-3 text-sm 
focus:border-[#81B7A9] focus:ring-2 focus:ring-[#81B7A9] focus:outline-none"

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
      <h3 className="text-lg font-semibold text-center mb-6">Laporan Assessment Terapi Okupasi</h3>

      <label className="block font-medium mb-1">Catatan</label>
      <textarea
        value={reportNotes}
        onChange={(e) => setReportNotes(e.target.value)}
        rows={4}
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Catatan..."
      />

      <label className="block font-medium mb-1">Hasil Assessment</label>
      <textarea
        value={reportResult}
        onChange={(e) => setReportResult(e.target.value)}
        rows={4}
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Hasil assessment..."
      />

      <label className="block font-medium mb-2">Rekomendasi Terapi</label>
      <div className="flex flex-wrap gap-6">
        {["PLB (Paedagog)", "Terapi Okupasi", "Terapi Wicara", "Fisioterapi"].map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="radio"
              name="rekomendasi"
              value={opt}
              checked={recommendation === opt}
              onChange={() => setRecommendation(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#81B7A9] text-white rounded-lg"
        >
          Simpan
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1">
        <HeaderTerapis />
        <div className="p-6">

          {/* Current Section */}
          <div className="space-y-6">
            {!isSummary && currentSectionKey ? (
              <SectionCard sectionId={currentSectionKey} />
            ) : (
              <SummaryCard />
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-6">
            <div>
              {stepIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="px-5 py-2 bg-white border rounded-lg shadow-sm text-[#36315B]"
                >
                  Kembali
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
                  Lanjut
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg text-white"
                  style={{ backgroundColor: "#81B7A9" }}
                >
                  Simpan
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
