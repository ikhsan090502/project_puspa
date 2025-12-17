"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";

/* ================= TAB ================= */
const tabs = ["Oral Fasial", "Kemampuan Bahasa"] as const;
type TabType = (typeof tabs)[number];

/* ================= LIDAH ASPEK ================= */
const LIDAH_ASPEK = [
  { title: "Evaluasi Lidah (Istirahat)", range: [135, 139] },
  { title: "Evaluasi Lidah (Keluar)", range: [140, 144] },
  { title: "Evaluasi Lidah (Masuk)", range: [145, 148] },
  { title: "Evaluasi Lidah (Kanan)", range: [149, 151] },
  { title: "Evaluasi Lidah (Kiri)", range: [152, 154] },
  { title: "Evaluasi Lidah (Atas)", range: [155, 157] },
  { title: "Evaluasi Lidah (Bawah)", range: [158, 160] },
  { title: "Evaluasi Lidah (Alternatif)", range: [161, 163] },
];

/* ================= SAFE PARSE ================= */
const parseOptions = (opt: any): string[] => {
  if (Array.isArray(opt)) return opt;
  if (typeof opt === "string") {
    try {
      const parsed = JSON.parse(opt);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function AsesmenWicaraPage() {
  const params = useSearchParams();
  const router = useRouter();
  const assessmentId = params.get("assessment_id") || "";

  const [activeTab, setActiveTab] = useState<TabType>("Oral Fasial");
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [sections, setSections] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      const apiType =
        activeTab === "Oral Fasial" ? "wicara_oral" : "wicara_bahasa";

      const res = await getAssessmentQuestions(apiType);
      const groups = res?.groups ?? [];

      const mapped = groups.map((g: any) => {
        if (g.group_key === "tongue_eval") {
          return {
            title: g.title,
            group_key: g.group_key,
            aspek: LIDAH_ASPEK.map((a) => ({
              title: a.title,
              questions: g.questions
                .filter((q: any) => q.id >= a.range[0] && q.id <= a.range[1])
                .map((q: any) => ({
                  id: q.id,
                  label: q.question_text,
                  options: parseOptions(q.answer_options),
                })),
            })).filter((a) => a.questions.length > 0),
          };
        }

        return {
          title: g.title,
          group_key: g.group_key,
          questions: g.questions.map((q: any) => ({
            id: q.id,
            label: q.question_text,
            options: parseOptions(q.answer_options),
            age_category: q.age_category,
          })),
        };
      });

      setSections(mapped);

      /* ===== INIT RESPONSE ===== */
      if (activeTab === "Kemampuan Bahasa") {
        const init: Record<string, boolean> = {};
        mapped.forEach((s: any) => {
          s.questions?.forEach((q: any) => {
            init[`${s.group_key}-${q.id}`] = false;
          });
        });
        setResponses(init);
      } else {
        setResponses({});
        setNotes({});
      }

      setOpenSection(0);
    };

    fetchData();
  }, [activeTab]);

  /* ================= HANDLER ================= */
  const handleRadio = (key: string, value: string) =>
    setResponses((p) => ({ ...p, [key]: value }));

  const handleCheckbox = (key: string) =>
    setResponses((p) => ({ ...p, [key]: !p[key] }));

  const handleNote = (key: string, value: string) =>
    setNotes((p) => ({ ...p, [key]: value }));

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const answers: any[] = [];

    sections.forEach((s) => {
      // ===== LIDAH ASPEK =====
      s.aspek?.forEach((a: any) =>
        a.questions.forEach((q: any) => {
          const k = `${s.group_key}-${q.id}`;
          if (responses[k] !== undefined && responses[k] !== null) {
            answers.push({
              question_id: q.id,
              answer: { value: responses[k] },
              note: notes[k] || "",
            });
          }
        })
      );

      // ===== GROUP NORMAL =====
      s.questions?.forEach((q: any) => {
        const k = `${s.group_key}-${q.id}`;

        if (activeTab === "Oral Fasial") {
          if (responses[k] !== undefined && responses[k] !== null) {
            answers.push({
              question_id: q.id,
              answer: { value: responses[k] },
              note: notes[k] || "",
            });
          }
        } else {
          // Bahasa: hanya simpan jawaban yang diisi
          if (responses[k] !== undefined) {
            answers.push({
              question_id: q.id,
              answer: { value: Boolean(responses[k]) },
            });
          }
        }
      });
    });

    try {
      await submitAssessment(assessmentId, "wicara", { answers });

      if (activeTab === "Oral Fasial") {
        alert("Jawaban Oral Fasial berhasil disimpan");
        setActiveTab("Kemampuan Bahasa");
      } else {
        alert("Jawaban Kemampuan Bahasa berhasil disimpan");
        router.push("/terapis/asessment?type=wicara&status=completed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        "Terjadi kesalahan saat menyimpan jawaban. Pastikan tidak ada jawaban duplikat."
      );
    }
  };

  /* ================= RENDER ================= */
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
          <div className="flex gap-3 mb-6 border-b">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-2 ${
                  activeTab === t
                    ? "border-b-4 border-[#409E86] text-[#409E86]"
                    : "text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {sections.map((s, i) => (
            <div key={i} className="mb-6 bg-white rounded-xl shadow">
              <button
                onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full px-5 py-4 bg-[#C0DCD6] text-[#36315B] flex justify-between items-center font-semibold"
              >
                {s.title}
                <ChevronDown />
              </button>

              {openSection === i && (
                <div className="p-6 space-y-6">
                  {s.aspek?.map((a: any) => (
                    <div key={a.title}>
                      <h4 className="font-semibold text-[#409E86] mb-3">
                        {a.title}
                      </h4>
                      {a.questions.map((q: any) => {
                        const k = `${s.group_key}-${q.id}`;
                        return (
                          <div key={q.id} className="mb-4">
                            <p>{q.label}</p>
                            {q.options.map((o: string) => (
                              <label key={o} className="flex gap-2">
                                <input
                                  type="radio"
                                  name={k}
                                  checked={responses[k] === o}
                                  onChange={() => handleRadio(k, o)}
                                />
                                {o}
                              </label>
                            ))}
                            <input
                              className="w-full border mt-2 p-2"
                              placeholder="Catatan..."
                              value={notes[k] || ""}
                              onChange={(e) => handleNote(k, e.target.value)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {s.questions?.map((q: any) => {
                    const k = `${s.group_key}-${q.id}`;
                    return (
                      <div key={q.id} className="mb-4">
                        {activeTab === "Oral Fasial" ? (
                          <>
                            <p>{q.label}</p>
                            {q.options.map((o: string) => (
                              <label key={o} className="flex gap-2">
                                <input
                                  type="radio"
                                  name={k}
                                  checked={responses[k] === o}
                                  onChange={() => handleRadio(k, o)}
                                />
                                {o}
                              </label>
                            ))}
                            <input
                              className="w-full border mt-2 p-2"
                              placeholder="Catatan..."
                              value={notes[k] || ""}
                              onChange={(e) => handleNote(k, e.target.value)}
                            />
                          </>
                        ) : (
                          <label className="flex gap-2 items-center">
                            <input
                              type="checkbox"
                              checked={Boolean(responses[k])}
                              onChange={() => handleCheckbox(k)}
                            />
                            <span>{q.label}</span>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#36315B] text-white rounded-xl"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
