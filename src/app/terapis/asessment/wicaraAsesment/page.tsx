"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useRouter } from "next/navigation";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";

const tabs = ["Oral Fasial", "Kemampuan Bahasa"] as const;
type TabType = (typeof tabs)[number];

const apiTypeMap: Record<TabType, "wicara_oral" | "wicara_bahasa"> = {
  "Oral Fasial": "wicara_oral",
  "Kemampuan Bahasa": "wicara_bahasa",
};

export default function AsesmenPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Oral Fasial");
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // responses keyed by `${group_key}-${question_id}`
  // for Oral: value is option string (e.g. "normal") stored as string
  // for Bahasa: value is "yes" or "no" stored as string
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const router = useRouter();
  const assessmentId = "1"; // adjust as needed

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const apiType = apiTypeMap[activeTab];
        const raw = await getAssessmentQuestions(apiType);

        const groups = raw?.groups ?? [];

        const formatted = groups.map((g: any) => ({
          title: g.title ?? g.group_name ?? "Untitled",
          group_key: g.group_key ?? g.group_name ?? "group",
          // support both formats: g.questions or g.subgroups -> flatten if necessary
          questions: (g.questions ?? []).map((q: any) => ({
            id: q.id,
            label: q.question_text ?? q.question,
            answer_type: q.answer_type ?? q.type ?? "select_with_note",
            // q.answer_options may be a JSON string or already array
            options:
              typeof q.answer_options === "string"
                ? (() => {
                    try {
                      return JSON.parse(q.answer_options);
                    } catch {
                      return [];
                    }
                  })()
                : Array.isArray(q.answer_options)
                ? q.answer_options
                : Array.isArray(q.options)
                ? q.options
                : [],
          })),
        }));

        setQuestionsData(formatted);
        setResponses({});
        setNotes({});
        setOpenSection(null);
      } catch (e) {
        console.error("Gagal load pertanyaan", e);
        setQuestionsData([]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [activeTab]);

  // Handlers
  const handleRadio = (qKey: string, value: string) => {
    setResponses((prev) => ({ ...prev, [qKey]: value }));
  };

  const handleCheck = (qKey: string) => {
    setResponses((prev) => {
      const prevVal = prev[qKey];
      return { ...prev, [qKey]: prevVal === "yes" ? "no" : "yes" };
    });
  };

  const handleNote = (qKey: string, value: string) => {
    setNotes((prev) => ({ ...prev, [qKey]: value }));
  };

  // Utility to check if a response exists (we treat empty string / undefined as missing)
  const hasResponse = (val: any) => val !== undefined && val !== null && String(val).trim() !== "";

  // Submit - produce payload matching BE:
  // - Oral: answer: { value: <string>, note: <string|null> }
  // - Bahasa: answer: { value: "yes" | "no", note: null }
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      const apiType = apiTypeMap[activeTab];
      let answers: any[] = [];

      // Build answers array
      answers = questionsData.flatMap((section) =>
        section.questions.map((q: any) => {
          const key = `${section.group_key}-${q.id}`;
          const userVal = responses[key];

          // Validate presence: allow values like "no", "none", 0, etc. Only missing if undefined/null/empty string.
          if (!hasResponse(userVal)) {
            throw new Error("Semua pertanyaan harus diisi sebelum submit!");
          }

          if (apiType === "wicara_oral") {
            const note = notes[key] && notes[key].trim() !== "" ? notes[key] : null;
            return {
              question_id: q.id,
              answer: {
                value: userVal, // e.g. "normal" or a selected option
                note: note,
              },
            };
          } else {
            // Kemampuan Bahasa: backend expects object too (value + note)
            // We'll send note null for bahasa entries
            return {
              question_id: q.id,
              answer: {
                value: userVal, // "yes" or "no"
                note: null,
              },
            };
          }
        })
      );

      const payload = { answers };
      console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

      // call submitAssessment(assessmentId, apiType, payload)
      const submitRes = await submitAssessment(assessmentId, apiType, payload);

      console.log("SUBMIT RESPONSE:", submitRes);

      // If backend returns success message, show popup
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        if (activeTab === "Oral Fasial") {
          setActiveTab("Kemampuan Bahasa");
        } else {
          router.push(`/terapis/asessment?type=wicara&status=completed`);
        }
      }, 700);
    } catch (err: any) {
      // show detailed backend error when available
      console.error("Gagal submit", err);
      const be = err?.response?.data;
      if (be) {
        console.error("BE RESPONSE:", be);
        alert(be.message || JSON.stringify(be));
      } else {
        alert(err.message || "Gagal submit data");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1">
        <HeaderTerapis />

        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-2 font-medium transition ${
                  activeTab === t
                    ? "border-b-4 border-[#409E86] text-[#409E86]"
                    : "text-[#36315B] hover:text-[#409E86]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loadingQuestions && <p>Loading pertanyaan...</p>}

          {/* Sections */}
          {!loadingQuestions &&
            questionsData.map((section, i) => {
              const open = openSection === i;
              return (
                <div key={i} className="mb-6 bg-white shadow-md rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenSection(open ? null : i)}
                    className="w-full px-5 py-4 flex justify-between items-center font-semibold bg-[#C0DCD6] text-[#36315B]"
                  >
                    {section.title}
                    <ChevronDown className={`w-5 h-5 ${open ? "rotate-180" : ""} transition`} />
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 py-5 space-y-5"
                      >
                        {section.questions.map((q: any, j: number) => {
                          const key = `${section.group_key}-${q.id}`;
                          const hasOptions = Array.isArray(q.options) && q.options.length > 0;

                          // ORAL FASIAL
                          if (activeTab === "Oral Fasial") {
                            if (q.answer_type === "select_with_note") {
                              return (
                                <div key={j} className="border-b pb-4">
                                  <p className="font-medium text-sm mb-2">{q.label}</p>

                                  <div className="flex flex-col gap-2">
                                    {hasOptions &&
                                      q.options.map((opt: string, idx: number) => (
                                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                          <input
                                            type="radio"
                                            name={key}
                                            value={opt}
                                            checked={responses[key] === opt}
                                            onChange={() => handleRadio(key, opt)}
                                            className="focus:ring-[#36315B] focus:ring-2 accent-[#36315B]"
                                          />
                                          <span className="text-sm">{opt}</span>
                                        </label>
                                      ))}
                                  </div>

                                  <input
                                    type="text"
                                    placeholder="Catatan..."
                                    value={notes[key] || ""}
                                    onChange={(e) => handleNote(key, e.target.value)}
                                    className="mt-2 w-full border p-2 rounded-lg text-sm"
                                  />
                                </div>
                              );
                            }

                            // fallback render if no special type
                            return (
                              <div key={j} className="border-b pb-4">
                                <p className="font-medium text-sm">{q.label}</p>
                              </div>
                            );
                          }

                          // KEMAMPUAN BAHASA
                          if (activeTab === "Kemampuan Bahasa") {
                            if (q.answer_type === "boolean") {
                              return (
                                <div key={j} className="border-b pb-4 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={responses[key] === "yes"}
                                    onChange={() => handleCheck(key)}
                                    className="cursor-pointer focus:ring-[#36315B] focus:ring-2 accent-[#36315B]"
                                  />
                                  <p className="font-medium text-sm m-0">{q.label}</p>
                                </div>
                              );
                            }

                            // fallback render
                            return (
                              <div key={j} className="border-b pb-4">
                                <p className="font-medium text-sm">{q.label}</p>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={loadingSubmit}
              className="px-6 py-2 rounded-xl text-white bg-[#36315B] hover:bg-[#81B7A9] disabled:opacity-60"
            >
              {loadingSubmit ? "Mengirim..." : "Simpan / Lanjutkan"}
            </button>
          </div>
        </div>
      </div>

      {/* Success popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-lg font-semibold text-[#36315B] mb-2">✅ Berhasil!</h2>
            <p className="text-gray-600 mb-4">Assessment berhasil disimpan.</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-[#36315B] hover:bg-[#81B7A9] text-white px-5 py-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
