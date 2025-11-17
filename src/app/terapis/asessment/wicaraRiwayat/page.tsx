"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

import { getAssessmentAnswers } from "@/lib/api/asesment";

export default function RiwayatWicaraPage() {
  const tabs = ["Oral Fasial", "Kemampuan Bahasa"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openSection, setOpenSection] = useState<number | null>(0);

  const [oralFasial, setOralFasial] = useState<any[]>([]);
  const [kemampuanBahasa, setKemampuanBahasa] = useState<any[]>([]);

  const [responses, setResponses] = useState<any>({});
  const [notes, setNotes] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJson = async () => {
      const oral = await import("@/data/wicaraOral.json");
      const bahasa = await import("@/data/wicaraKemampuanbahasa.json");

      setOralFasial(oral.default);
      setKemampuanBahasa(bahasa.default);
    };
    loadJson();
  }, []);

  const data = activeTab === "Oral Fasial" ? oralFasial : kemampuanBahasa;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAssessmentAnswers("1", "wicara");

        const resp: any = {};
        const nt: any = {};

        if (Array.isArray(result.oral_fasial)) {
          result.oral_fasial.forEach((item: any) => {
            const key = `Oral Fasial-${item.question}`;
            resp[key] = item.answer || "";
            nt[key] = item.note || "";
          });
        }

        if (Array.isArray(result.kemampuan_bahasa)) {
          result.kemampuan_bahasa.forEach((item: any) => {
            const key = `Kemampuan Bahasa-${item.skill}`;

            if (!resp[key]) resp[key] = [];
            if (item.checked) resp[key].push(item.skill);
          });
        }

        setResponses(resp);
        setNotes(nt);
      } catch (err) {
        console.error("Gagal load riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || oralFasial.length === 0) {
    return <p className="p-6">Memuat riwayat...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />

      <div className="flex-1">
        <HeaderTerapis />

        <div className="p-6">

          {/* TAB HEADER */}
          <div className="flex gap-3 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 font-medium transition ${
                  activeTab === tab
                    ? "border-b-4 border-[#409E86] text-[#409E86]"
                    : "text-[#36315B] hover:text-[#409E86]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* LIST SECTION */}
          {data.map((section, i) => (
            <div key={i} className="mb-6 rounded-2xl bg-white shadow-md overflow-hidden">

              {/* HEADER — sudah diperbaiki */}
              <button
                onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full flex justify-between items-center px-5 py-4 bg-[#36315B] text-white"
              >
                <span className="font-semibold">{section.title}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSection === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* CONTENT */}
              <AnimatePresence>
                {openSection === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-5 space-y-6"
                  >
                    {section.questions.map((q: any, j: number) => {
                      const qKey = `${section.title}-${q.label}`;

                      return activeTab === "Oral Fasial" ? (
                        <div key={j} className="flex flex-col md:flex-row justify-between gap-4 border-b pb-4">

                          <div className="md:w-2/3">
                            <p className="text-gray-700 font-medium text-sm mb-2">{q.label}:</p>

                            <div className="flex flex-col gap-2">
                              {q.options?.map((opt: string, k: number) => (
                                <label key={k} className="flex items-center gap-2 text-sm">
                                  <input type="radio" checked={responses[qKey] === opt} disabled />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="md:w-1/3">
                            <input
                              type="text"
                              value={notes[qKey] || ""}
                              readOnly
                              className="w-full border rounded-lg p-2 text-sm bg-gray-100"
                            />
                          </div>
                        </div>
                      ) : (
                        <div key={j} className="flex items-start gap-3 border-b pb-2">
                          <input
                            type="checkbox"
                            disabled
                            checked={
                              Array.isArray(responses[qKey]) &&
                              responses[qKey].includes(q.label)
                            }
                          />
                          <p className="text-gray-700 text-sm">{q.label}</p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
