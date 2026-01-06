"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";

export default function TerapiWicaraPageReadOnlyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 3;

  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        const res = await getParentAssessmentAnswers(
          assessmentId,
          "wicara_parent" as ParentSubmitType
        );

        const data = res?.data || [];
        setItems(data);
      } catch (err) {
        console.error("❌ Gagal ambil data wicara:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  if (loading) {
    return (
      <ResponsiveOrangtuaLayout>
        <div className="p-10 text-center">Memuat riwayat wicara...</div>
      </ResponsiveOrangtuaLayout>
    );
  }

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-4xl">
      {/* STEPPER */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                i === activeStep
                  ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span className={i === activeStep ? "font-semibold" : "text-gray-400"}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className="w-10 h-px bg-gray-300 hidden md:block translate-y-[-10px]" />
            )}
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl p-6 shadow space-y-6">
        {items.map((q, i) => (
          <div key={i}>
            <p className="font-medium mb-2">
              {i + 1}. {q.question_text}
            </p>

            {Array.isArray(q.answer?.value) ? (
              <div className="space-y-2">
                {q.answer.value.map((row: any, idx: number) => (
                  <div key={idx} className="flex gap-4 border-b pb-2">
                    <span className="flex-1">{row.kegiatan}</span>
                    <input
                      readOnly
                      value={row.usia ?? "-"}
                      className="border rounded px-3 py-1 bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                readOnly
                value={q.answer?.value || "-"}
                className="w-full border rounded p-3 bg-gray-100"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 w-full bg-[#6BB1A0] text-white py-3 rounded-lg"
      >
        Kembali
      </button>
    </ResponsiveOrangtuaLayout>
  );
}
