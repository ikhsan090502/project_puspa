"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";

export default function DataFisioterapiPageReadOnlyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;

  const [keluhan, setKeluhan] = useState("");
  const [riwayat, setRiwayat] = useState("");
  const [loading, setLoading] = useState(true);

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 1;

  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        const res = await getParentAssessmentAnswers(
          assessmentId,
          "fisio_parent" as ParentSubmitType
        );

        const data = res?.data || [];
        setKeluhan(
          data.find((d: any) =>
            d.question_text.toLowerCase().includes("keluhan")
          )?.answer?.value || ""
        );
        setRiwayat(
          data.find((d: any) =>
            d.question_text.toLowerCase().includes("riwayat")
          )?.answer?.value || ""
        );
      } catch (err) {
        console.error("❌ Fisio error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  if (loading) {
    return (
      <ResponsiveOrangtuaLayout>
        <div className="p-10 text-center">Memuat riwayat fisioterapi...</div>
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
              className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${
                i === activeStep
                  ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                  : "bg-gray-100 border-gray-300 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <span className={i === activeStep ? "font-semibold" : "text-gray-400"}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl p-6 shadow space-y-6">
        <div>
          <label className="font-medium mb-2 block">Keluhan Utama</label>
          <textarea
            readOnly
            value={keluhan}
            className="w-full border rounded p-3 bg-gray-100"
          />
        </div>

        <div>
          <label className="font-medium mb-2 block">Riwayat Penyakit</label>
          <textarea
            readOnly
            value={riwayat}
            className="w-full border rounded p-3 bg-gray-100"
          />
        </div>
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
