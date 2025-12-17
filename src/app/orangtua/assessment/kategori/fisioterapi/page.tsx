"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import {
  getParentAssessmentQuestions,
  submitParentAssessment,
} from "@/lib/api/asesmentTerapiOrtu";

export default function DataFisioterapiPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ambil assessment_id dari query
  const assessmentId = searchParams.get("assessment_id");

  const [activeTab, setActiveTab] = useState<"keluhan" | "riwayat">("keluhan");

  // State pertanyaan
  const [keluhanQuestion, setKeluhanQuestion] = useState<any>(null);
  const [riwayatQuestion, setRiwayatQuestion] = useState<any>(null);

  // State jawaban
  const [keluhanJawaban, setKeluhanJawaban] = useState("");
  const [riwayatJawaban, setRiwayatJawaban] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Fetch pertanyaan
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await getParentAssessmentQuestions("parent_fisio");

        const questions = res?.data?.groups?.[0]?.questions || [];

        setKeluhanQuestion(
          questions.find((q: any) => q.question_number === "1")
        );
        setRiwayatQuestion(
          questions.find((q: any) => q.question_number === "2")
        );
      } catch (err) {
        console.error(err);
      }
    }

    fetchQuestions();
  }, []);

  // Submit API dengan format jawaban sesuai BE
  const handleSubmit = async () => {
    if (!assessmentId) {
      alert("Assessment ID tidak ditemukan.");
      return;
    }

    const payload = {
      answers: [
        {
          question_id: keluhanQuestion?.id,
          answer: {
            value: keluhanJawaban,
          },
        },
        {
          question_id: riwayatQuestion?.id,
          answer: {
            value: riwayatJawaban,
          },
        },
      ],
    };

    try {
      setLoading(true);
      await submitParentAssessment(assessmentId, "fisio_parent", payload);

      alert("Berhasil menyimpan data fisioterapi!");
     
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    {
      label: "Data Fisioterapi",
      path: "/orangtua/assessment/kategori/fisioterapi",
    },
    {
      label: "Data Terapi Okupasi",
      path: "/orangtua/assessment/kategori/okupasi",
    },
    {
      label: "Data Terapi Wicara",
      path: "/orangtua/assessment/kategori/wicara",
    },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/orangtua/assessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          {/* Step Progress */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center cursor-pointer">
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
                    <span
                      className={`text-sm font-medium ${
                        i === activeStep ? "text-[#36315B]" : "text-gray-500"
                      }`}
                    >
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

          {/* Card utama */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-4">II. Data Fisioterapi</h3>

            {/* Tab Button */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("keluhan")}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium mr-2 ${
                  activeTab === "keluhan"
                    ? "bg-[#EAF4F1] text-[#357960] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Keluhan
              </button>

              <button
                onClick={() => setActiveTab("riwayat")}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                  activeTab === "riwayat"
                    ? "bg-[#EAF4F1] text-[#357960] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Riwayat Penyakit
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "keluhan" && keluhanQuestion && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {keluhanQuestion.question_text}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:outline-none focus:ring-2 focus:ring-[#6CC3AD]"
                    placeholder={`Tuliskan ${keluhanQuestion.question_text.toLowerCase()}...`}
                    value={keluhanJawaban}
                    onChange={(e) => setKeluhanJawaban(e.target.value)}
                  ></textarea>
                </div>
              )}

              {activeTab === "riwayat" && riwayatQuestion && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {riwayatQuestion.question_text}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:outline-none focus:ring-2 focus:ring-[#6CC3AD]"
                    placeholder={`Tuliskan ${riwayatQuestion.question_text.toLowerCase()}...`}
                    value={riwayatJawaban}
                    onChange={(e) => setRiwayatJawaban(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-end mt-8">
              {activeTab === "keluhan" ? (
                <button
                  onClick={() => setActiveTab("riwayat")}
                  className="px-6 py-2 bg-[#6CC3AD] text-white rounded-lg hover:bg-[#5bb49b]"
                >
                  Lanjutkan
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#6CC3AD] hover:bg-[#5bb49b]"
                  }`}
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
