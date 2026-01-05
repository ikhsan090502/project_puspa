"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";

export default function DataFisioterapiPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id");

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" }
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  const [dataRiwayat, setDataRiwayat] = useState({
    keluhan: "",
    riwayat: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      console.warn("assessment_id tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getParentAssessmentAnswers(
          assessmentId as string,
          "fisio_parent" as ParentSubmitType
        );

        const dataArray = res?.data || [];

        const keluhanObj = dataArray.find(
          (item: any) =>
            item.question_text.toLowerCase().includes("keluhan utama")
        );

        const riwayatObj = dataArray.find(
          (item: any) =>
            item.question_text.toLowerCase().includes("riwayat penyakit")
        );

        setDataRiwayat({
          keluhan: keluhanObj?.answer?.value || "",
          riwayat: riwayatObj?.answer?.value || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal mengambil data jawaban");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  return (
    <ResponsiveOrangtuaLayout>
      {/* Step Progress */}
      <div className="flex flex-wrap justify-center mb-8 md:mb-12 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-wrap gap-2">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  i === activeStep
                    ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm font-medium ${i === activeStep ? "text-[#36315B]" : "text-gray-500"}`}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className="w-8 md:w-12 h-px bg-gray-300 mx-1 md:mx-2 hidden md:block translate-y-[-12px]" />
            )}
          </div>
        ))}
      </div>

      {/* Card utama read-only */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8 w-full max-w-4xl mx-auto">
        <h3 className="text-lg md:text-xl font-semibold mb-6">
          II. Data Fisioterapi (Riwayat Jawaban)
        </h3>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-6">

            {/* Keluhan */}
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Keluhan utama yang dialami anak saat ini:
              </label>
              <textarea
                readOnly
                value={dataRiwayat.keluhan}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700 min-h-[120px] resize-none"
              />
            </div>

            {/* Riwayat */}
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Riwayat penyakit atau kondisi yang berhubungan dengan fisioterapi:
              </label>
              <textarea
                readOnly
                value={dataRiwayat.riwayat}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700 min-h-[120px] resize-none"
              />
            </div>
          </div>
        )}

        {/* Button Back */}
        <div className="flex justify-end mt-6 md:mt-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}