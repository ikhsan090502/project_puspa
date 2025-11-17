"use client";

import React, { useEffect, useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import paedagogData from "@/data/paedagogAssessment.json";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  label: string;
  type: "radio" | "text";
  options?: string[];
  placeholder?: string;
};

type Section = {
  key: string;
  label: string;
  questions: Question[];
};

type Aspect = {
  key: string;
  label: string;
  questions?: Question[];
  sections?: Section[];
};

export default function PaedagogFormPage() {
  const router = useRouter();
  const aspects: Aspect[] = (paedagogData as any).aspects || [];

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => step.label === "Data Paedagog");

  const [activeAspectKey, setActiveAspectKey] = useState<string>(
    aspects[0]?.key ?? ""
  );

  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const init: Record<string, any> = {};

    aspects.forEach((asp) => {
      init[asp.key] = {};

      if (asp.questions) {
        asp.questions.forEach((q) => {
          init[asp.key][q.id] = "";
        });
      }

      if (asp.sections) {
        asp.sections.forEach((sec) => {
          init[asp.key][sec.key] = {};
          sec.questions.forEach((q) => {
            init[asp.key][sec.key][q.id] = "";
          });
        });
      }
    });

    setAnswers(init);
  }, [paedagogData]);

  const handleChange = (
    aspectKey: string,
    sectionKey: string | null,
    qid: string,
    value: string
  ) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      if (sectionKey) {
        updated[aspectKey][sectionKey][qid] = value;
      } else {
        updated[aspectKey][qid] = value;
      }
      return updated;
    });
  };

  const activeAspect: Aspect | undefined = aspects.find(
    (a) => a.key === activeAspectKey
  );

  const onSave = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      answers,
    };
    console.log("PAYLOAD:", payload);
    alert("Jawaban disimpan (cek console)");
  };

  const handleNextAspect = () => {
    const currentIndex = aspects.findIndex((a) => a.key === activeAspectKey);
    const nextAspect = aspects[currentIndex + 1];
    if (nextAspect) setActiveAspectKey(nextAspect.key);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      {/* Sidebar */}
      <SidebarOrangtua />

      {/* Main Frame */}
      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Step Progress */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center cursor-pointer"
                  onClick={() => router.push(step.path)}
                >
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
                    <span className="text-sm font-medium text-[#36315B]">
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

          {/* Selector Aspek */}
          <div className="mb-6 flex justify-end">
            <select
              value={activeAspectKey}
              onChange={(e) => setActiveAspectKey(e.target.value)}
              className="border rounded-lg px-3 py-2 text-[#36315B]"
            >
              {aspects.map((asp) => (
                <option key={asp.key} value={asp.key}>
                  {asp.label}
                </option>
              ))}
            </select>
          </div>

          {/* Card Content */}
          <div className="bg-white rounded-xl p-5 shadow">
            <h2 className="font-semibold text-lg mb-3 text-[#36315B]">
              {activeAspect?.label}
            </h2>

            {/* Pertanyaan langsung di aspek */}
            {activeAspect?.questions && (
              <div className="space-y-2">
                {activeAspect.questions.map((q, index) => (
                  <div key={q.id} className="bg-gray-50 p-2 rounded-lg">
                    <label className="block mb-1 font-medium text-[#36315B]">
                      {["ketunaan", "sosialisasi"].includes(
                        activeAspectKey.toLowerCase()
                      )
                        ? q.label
                        : `${index + 1}. ${q.label}`}
                    </label>

                    {q.type === "radio" ? (
                      <div className="flex gap-4">
                        {q.options?.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="radio"
                              name={`${activeAspectKey}-${q.id}`}
                              checked={answers[activeAspectKey]?.[q.id] === opt}
                              onChange={() =>
                                handleChange(activeAspectKey, null, q.id, opt)
                              }
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="w-full border px-3 py-2 rounded text-[#36315B]"
                        placeholder={q.placeholder ?? ""}
                        value={answers[activeAspectKey]?.[q.id] ?? ""}
                        onChange={(e) =>
                          handleChange(activeAspectKey, null, q.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pertanyaan di dalam section */}
            {activeAspect?.sections && (
              <div className="space-y-5 mt-4">
                {activeAspect.sections.map((sec) => (
                  <div
                    key={sec.key}
                    className="border rounded-lg p-4 bg-[#FAFAFA] shadow-sm"
                  >
                    <h3 className="font-semibold text-base mb-3 text-[#36315B]">
                      {sec.label}
                    </h3>

                    <div className="space-y-2">
                      {sec.questions.map((q, index) => (
                        <div key={q.id} className="bg-gray-50 p-2 rounded-lg">
                          <label className="block mb-1 text-sm font-medium text-[#36315B]">
                            {["ketunaan", "sosialisasi"].includes(
                              activeAspectKey.toLowerCase()
                            )
                              ? q.label
                              : `${index + 1}. ${q.label}`}
                          </label>

                          {q.type === "radio" ? (
                            <div className="flex gap-4">
                              {q.options?.map((opt) => (
                                <label
                                  key={opt}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    name={`${activeAspectKey}-${sec.key}-${q.id}`}
                                    checked={
                                      answers[activeAspectKey]?.[sec.key]?.[q.id] ===
                                      opt
                                    }
                                    onChange={() =>
                                      handleChange(activeAspectKey, sec.key, q.id, opt)
                                    }
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder={q.placeholder ?? ""}
                              className="w-full border px-3 py-2 rounded text-[#36315B]"
                              value={answers[activeAspectKey]?.[sec.key]?.[q.id] ?? ""}
                              onChange={(e) =>
                                handleChange(activeAspectKey, sec.key, q.id, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white border rounded-lg text-[#36315B]"
            >
              Kembali
            </button>

            {activeAspectKey.toLowerCase() === "sosialisasi" ? (
              <button
                onClick={onSave}
                className="px-6 py-2 bg-[#81B7A9] text-[#36315B] rounded-lg"
              >
                Simpan
              </button>
            ) : (
              <button
                onClick={handleNextAspect}
                className="px-6 py-2 bg-[#81B7A9] text-[#36315B] rounded-lg"
              >
                Lanjutkan
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
