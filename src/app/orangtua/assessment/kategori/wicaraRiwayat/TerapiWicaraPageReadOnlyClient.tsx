"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getParentAssessmentAnswers,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";

export default function TerapiWicaraPageReadOnlyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;
  const type: ParentSubmitType = "wicara_parent";

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!assessmentId) {
      setErrorMsg("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await getParentAssessmentAnswers(assessmentId, type);

        if (!res.success) {
          setErrorMsg("Gagal mengambil data dari server.");
          setLoading(false);
          return;
        }

        const data = res.data;
        if (!Array.isArray(data)) {
          setErrorMsg("Format data jawaban tidak valid.");
          setLoading(false);
          return;
        }

        const parsed = data.map((q: any) => {
          const val = q.answer?.value;
          if (Array.isArray(val)) return { ...q, answer: val, answer_type: "table" };
          if (typeof val === "string") return { ...q, answer: val, answer_type: "textarea" };
          return { ...q, answer: "", answer_type: "textarea" };
        });

        setItems(parsed);
      } catch (err) {
        console.error("API ERROR:", err);
        setErrorMsg("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [assessmentId]);

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 3;

  if (loading) return <div className="p-10 text-center text-lg font-medium">Memuat jawaban...</div>;
  if (errorMsg) return <div className="p-10 text-center text-red-600 font-semibold">{errorMsg}</div>;

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-4xl">
      {/* Stepper */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  i === activeStep ? "bg-[#6BB1A0] border-[#6BB1A0] text-white" : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-sm font-medium text-center ${i === activeStep ? "text-[#36315B]" : "text-gray-500"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-10 h-px bg-gray-300 mx-2 hidden sm:block translate-y-[-12px]" />}
          </div>
        ))}
      </div>

      {/* Konten jawaban */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div className="space-y-6">
          {items.map((q: any, index: number) => (
            <div key={index} className="mb-6">
              <label className="block font-medium mb-2">
                {q.question_number || index + 1}. {q.question_text}
              </label>

              {/* Textarea */}
              {(q.answer_type === "textarea" || q.answer_type === "text") && (
                <textarea
                  className="w-full border rounded-lg p-3 h-24 bg-gray-100 text-gray-700 resize-none"
                  value={q.answer || ""}
                  readOnly
                  disabled
                />
              )}

              {/* Table */}
              {q.answer_type === "table" && Array.isArray(q.answer) && (
                <div className="overflow-x-auto mt-2">
                  <div className="min-w-[300px] space-y-2">
                    {q.answer.map((row: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b pb-2">
                        <span className="flex-1 font-medium">{row.kegiatan}</span>
                        <input
                          type="text"
                          value={row.usia ?? ""}
                          className="border rounded-lg p-2 w-full sm:w-40 bg-gray-100 text-gray-700"
                          readOnly
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="mt-8 bg-[#6BB1A0] text-white px-6 py-3 rounded-xl shadow-md w-full hover:bg-[#58a88f] transition"
          onClick={() => router.back()}
        >
          Kembali
        </button>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}