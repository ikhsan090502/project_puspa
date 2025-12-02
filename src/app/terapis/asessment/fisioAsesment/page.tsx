"use client";

import React, { useEffect, useState } from "react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useSearchParams } from "next/navigation";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";

export default function Page() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("Pemeriksaan Umum");

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [responses, setResponses] = useState<{ [key: string]: any }>({});

  const pemeriksaanKhususList = [
    { key: "pemeriksaan_sensoris", label: "Pemeriksaan Sensoris" },
    { key: "pemeriksaan_refleks_primitif", label: "Pemeriksaan Reflek Primitif" },
    { key: "gross_motor_pola_gerak", label: "Gross Motor & Pola Gerak" },
    { key: "test_joint_laxity", label: "Test Joint Laxity" },
    { key: "pemeriksaan_spastisitas", label: "Pemeriksaan Spastisitas" },
    { key: "pemeriksaan_kekuatan_otot", label: "Pemeriksaan Kekuatan Otot" },
    { key: "palpasi_otot", label: "Palpasi Otot" },
    { key: "jenis_spastisitas", label: "Jenis Spastisitas" },
    { key: "test_fungsi_bermain", label: "Test Fungsi Bermain" },
    { key: "diagnosa_fisioterapi", label: "Diagnosa Fisioterapi" },
  ];

  const [selectedKhusus, setSelectedKhusus] = useState(pemeriksaanKhususList[0].key);

  const tabs = ["Pemeriksaan Umum", "Anamnesis Sistem", "Pemeriksaan Khusus"];

  useEffect(() => {
    if (!assessmentId) return;

    const load = async () => {
      setLoading(true);
      const data = await getAssessmentQuestions("fisio");
      setQuestions(data.groups || []);
      setLoading(false);
    };

    load();
  }, [assessmentId]);

  const filteredGroups =
    activeTab === "Pemeriksaan Khusus"
      ? questions.filter((g) => g.group_key === selectedKhusus)
      : activeTab === "Pemeriksaan Umum"
      ? questions.filter((g) => g.group_key === "pemeriksaan_umum")
      : questions.filter((g) => g.group_key === "anamnesis_sistem");

  const getQKey = (q: any, idx: number) => `q_${q.id ?? idx}`;

  const handleCheck = (key: string, value: string) => {
    setResponses((prev) => {
      const arr = Array.isArray(prev[key]) ? prev[key] : [];
      return arr.includes(value)
        ? { ...prev, [key]: arr.filter((x: string) => x !== value) }
        : { ...prev, [key]: [...arr, value] };
    });
  };

  const handleRadio = (key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  const handleText = (key: string, v: string) => {
    setResponses((prev) => ({ ...prev, [key]: v }));
  };

  const handleMultiSegment = (key: string, segment: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [segment]: value },
    }));
  };

  const handleRadioWithText = (key: string, value: string, text?: string) => {
    setResponses((prev) => ({
      ...prev,
      [key]: { answer: value, text: text || "" },
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      answers: Object.keys(responses).map((key) => ({
        question_id: Number(key.replace("q_", "")),
        answer: responses[key],
      })),
    };
    await submitAssessment(assessmentId!, "fisio", payload);
    alert("Assessment berhasil disimpan!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Memuat pertanyaan...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1">
        <HeaderTerapis />
        <div className="p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          {step === 1 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Pemeriksaan</h2>

              {/* TAB */}
              <div className="flex gap-6 border-b mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 ${
                      activeTab === tab
                        ? "border-b-4 border-[#3A9C85] text-[#3A9C85] font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* PEMERIKSAAN KHUSUS */}
              {activeTab === "Pemeriksaan Khusus" && (
                <div className="mb-6">
                  <label className="text-sm font-medium">Aspek Pemeriksaan Khusus</label>
                  <select
                    value={selectedKhusus}
                    onChange={(e) => setSelectedKhusus(e.target.value)}
                    className="border rounded-lg px-3 py-2 mt-1 w-full"
                  >
                    {pemeriksaanKhususList.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* TAMPILKAN PERTANYAAN */}
              {filteredGroups.length === 0 && (
                <div className="text-gray-500">Tidak ada pertanyaan pada grup ini.</div>
              )}

              {filteredGroups.map((section: any) => (
                <div key={section.group_id} className="mb-6">
                  <div className="px-5 py-3 bg-[#CFE7E1] rounded-lg font-semibold mb-3">{section.title}</div>
                  <div className="p-3">
                    {(section.questions ?? []).map((q: any, idx: number) => {
                      const qKey = getQKey(q, idx);
                      const options: string[] = q.answer_options ? JSON.parse(q.answer_options) : [];

                      return (
                        <div key={`${section.group_id}_${qKey}`} className="mb-6">
                          <div className="font-medium mb-2">{q.question_text}</div>

                          {/* Checkbox */}
                          {q.answer_type === "checkbox" && (
                            <div className="flex gap-6 flex-wrap">
                              {options.map((opt) => (
                                <label key={opt} className="flex gap-2">
                                  <input
                                    type="checkbox"
                                    checked={responses[qKey]?.includes(opt) || false}
                                    onChange={() => handleCheck(qKey, opt)}
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Radio */}
                          {q.answer_type === "radio" && (
                            <div className="flex gap-6 flex-wrap">
                              {options.map((opt) => (
                                <label key={opt} className="flex gap-2">
                                  <input
                                    type="radio"
                                    name={qKey}
                                    checked={responses[qKey] === opt}
                                    onChange={() => handleRadio(qKey, opt)}
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Radio with text */}
                          {q.answer_type === "radio_with_text" && (
                            <div className="flex flex-col gap-2">
                              {options.map((opt) => (
                                <label key={opt} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={qKey}
                                    checked={responses[qKey]?.answer === opt}
                                    onChange={() => handleRadioWithText(qKey, opt, "")}
                                  />
                                  {opt}
                                </label>
                              ))}
                              <input
                                type="text"
                                className="border px-3 py-2 rounded w-full"
                                placeholder={q.extra_schema ? JSON.parse(q.extra_schema).text_placeholder : ""}
                                value={responses[qKey]?.text || ""}
                                onChange={(e) =>
                                  handleRadioWithText(qKey, responses[qKey]?.answer || "", e.target.value)
                                }
                              />
                            </div>
                          )}

                          {/* Text */}
                          {q.answer_type === "text" && (
                            <input
                              type="text"
                              className="border px-3 py-2 rounded w-full"
                              value={responses[qKey] || ""}
                              onChange={(e) => handleText(qKey, e.target.value)}
                            />
                          )}

                          {/* Textarea */}
                          {q.answer_type === "textarea" && (
                            <textarea
                              className="border px-3 py-2 rounded w-full"
                              placeholder={q.extra_schema ? JSON.parse(q.extra_schema).placeholder : ""}
                              rows={q.extra_schema ? JSON.parse(q.extra_schema).rows : 4}
                              value={responses[qKey] || ""}
                              onChange={(e) => handleText(qKey, e.target.value)}
                            />
                          )}

                          {/* Multi-segment */}
                          {q.answer_type === "multi_segment" &&
                            q.extra_schema &&
                            (() => {
                              const extra = JSON.parse(q.extra_schema);
                              const segments = extra.answer_format || {};
                              const segmentLabels = extra.segment_labels || {};
                              const optionLabels = extra.option_labels || {};
                              return Object.entries(segments).map(([segment, optsUnknown]) => {
                                const opts = optsUnknown as string[];
                                const onlyValue = opts.length === 1 && opts[0] === "value";

                                return (
                                  <div key={segment} className="flex items-center gap-3 mb-2">
                                    <div className="w-48 text-sm">{segmentLabels[segment] || segment}</div>

                                    {onlyValue ? (
                                      <input
                                        type="text"
                                        className="border px-3 py-2 rounded w-full"
                                        value={responses[qKey]?.[segment] || ""}
                                        onChange={(e) => handleMultiSegment(qKey, segment, e.target.value)}
                                      />
                                    ) : (
                                      <select
                                        className="border rounded px-3 py-2 w-full"
                                        value={responses[qKey]?.[segment] || ""}
                                        onChange={(e) => handleMultiSegment(qKey, segment, e.target.value)}
                                      >
                                        <option value="">Pilih</option>
                                        {opts.map((opt) => (
                                          <option key={opt} value={opt}>
                                            {optionLabels[opt] || opt}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                );
                              });
                            })()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* BUTTON */}
              <div className="flex justify-between mt-8">
                <button
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => {
                    // Step 1: pindah ke tab sebelumnya jika ada
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                  disabled={tabs.indexOf(activeTab) === 0}
                >
                  Sebelumnya
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-[#3A9C85] text-white"
                  onClick={() => {
                    // Step 1: pindah ke tab berikutnya jika ada, kalau sudah terakhir pindah ke step 2
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    } else {
                      setStep(2);
                    }
                  }}
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-6">Diagnosa Fisioterapi</h2>
              <button className="px-6 py-2 bg-[#3A9C85] text-white rounded-lg" onClick={handleSubmit}>
                Simpan Assessment
              </button>
              <button
                className="ml-4 px-6 py-2 border rounded-lg"
                onClick={() => {
                  setStep(1);
                  setActiveTab(tabs[tabs.length - 1]); // kembali ke tab terakhir (Pemeriksaan Khusus)
                }}
              >
                Kembali
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
