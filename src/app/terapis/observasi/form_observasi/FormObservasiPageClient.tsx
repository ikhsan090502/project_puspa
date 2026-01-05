"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { submitObservation, getObservationQuestions } from "@/lib/api/observasiSubmit";

type Question = {
  question_id: number;
  observation_id: number;
  question_text: string;
  score: number;
  question_code: string;
  age_category: string;
  question_number?: number;
};

type Answer = {
  jawaban?: boolean;
  keterangan?: string;
};

const kategoriMap: Record<string, string> = {
  BPE: "Perilaku & Emosi",
  BFM: "Fungsi Motorik",
  BBB: "Bahasa & Bicara",
  BKA: "Kognitif & Atensi",
  BS: "Sosial & Emosi",
  APE: "Perilaku & Emosi",
  AFM: "Fungsi Motorik",
  ABB: "Bahasa & Bicara",
  AKA: "Kognitif & Atensi",
  AS: "Sosial & Emosi",
  RPE: "Perilaku & Emosi",
  RFM: "Fungsi Motorik",
  RBB: "Bahasa & Bicara",
  RKA: "Kognitif & Atensi",
  RS: "Sosial & Emosi",
  RK: "Kemandirian",
};

// ================= Helpers =================
function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function toQuestionArray(input: unknown): Question[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((row: any) => {
      const question_id = asNumber(row?.question_id, 0);
      const observation_id = asNumber(row?.observation_id, 0);
      const question_text = asString(row?.question_text, "").trim();
      const score = asNumber(row?.score, 0);
      const question_code = asString(row?.question_code, "").trim();
      const age_category = asString(row?.age_category, "").trim();
      const question_number_raw = row?.question_number;

      // minimal field wajib ada
      if (!question_id || !observation_id || !question_text || !question_code || !age_category) {
        return null;
      }

      const question_number =
        question_number_raw === undefined || question_number_raw === null
          ? undefined
          : asNumber(question_number_raw, undefined as any);

      const q: Question = {
        question_id,
        observation_id,
        question_text,
        score,
        question_code,
        age_category,
        ...(Number.isFinite(question_number as any) ? { question_number } : {}),
      };

      return q;
    })
    .filter(Boolean) as Question[];
}

export default function FormObservasiPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pasien = useMemo(
    () => ({
      nama: searchParams.get("nama") || "",
      usia: searchParams.get("usia") || "",
      kategori: searchParams.get("kategori") || "",
      tglObservasi: searchParams.get("tglObservasi") || "",
      observation_id: searchParams.get("observation_id") || searchParams.get("id") || "",
    }),
    [searchParams]
  );

  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [step, setStep] = useState<"observasi" | "kesimpulan" | "review">("observasi");
  const [kesimpulan, setKesimpulan] = useState("");
  const [rekomendasiLanjutan, setRekomendasiLanjutan] = useState("");
  const [rekomendasiAssessment, setRekomendasiAssessment] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil pertanyaan
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!pasien.observation_id) {
        alert("Observation ID tidak ditemukan di URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const raw = await getObservationQuestions(pasien.observation_id);
        const data = toQuestionArray(raw);

        if (cancelled) return;

        if (data.length > 0) {
          setQuestionsData(data);

          const firstCode = data[0]?.question_code || "UNK-0";
          const firstPrefix = firstCode.split("-")[0];
          setActiveTab(kategoriMap[firstPrefix] || firstPrefix);
        } else {
          setQuestionsData([]);
          setActiveTab("");
          alert("Tidak ada pertanyaan untuk observasi ini.");
        }
      } catch (err) {
        console.error("Gagal mengambil data observasi:", err);
        alert("Terjadi kesalahan saat memuat data observasi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [pasien.observation_id]);

  // 🔹 Kelompokkan pertanyaan per kategori
  const groupedQuestions = useMemo(() => {
    return questionsData.reduce((acc: Record<string, Question[]>, q) => {
      const prefix = (q.question_code || "UNK-0").split("-")[0];
      const kategori = kategoriMap[prefix] || prefix;
      if (!acc[kategori]) acc[kategori] = [];
      acc[kategori].push(q);
      return acc;
    }, {});
  }, [questionsData]);

  const kategoriList = Object.keys(groupedQuestions);

  const totalScore = useMemo(() => {
    return questionsData.reduce((acc, q) => {
      const score = Number(q.score) || 0;
      if (answers[q.question_id]?.jawaban) return acc + score;
      return acc;
    }, 0);
  }, [questionsData, answers]);

  const handleChange = (id: number, field: keyof Answer, value: string | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleNext = () => {
    const pertanyaanKategori = groupedQuestions[activeTab] || [];
    const belumDiisi = pertanyaanKategori.some(
      (q) => answers[q.question_id]?.jawaban === undefined
    );
    if (belumDiisi) return alert("Harap isi semua jawaban sebelum lanjut.");

    const idx = kategoriList.indexOf(activeTab);
    if (idx < kategoriList.length - 1) setActiveTab(kategoriList[idx + 1]);
  };

  const handlePrev = () => {
    const idx = kategoriList.indexOf(activeTab);
    if (idx > 0) setActiveTab(kategoriList[idx - 1]);
  };

  const handleAssessmentChange = (value: string, checked: boolean) => {
    setRekomendasiAssessment((prev) => {
      if (checked) return [...prev, value];
      return prev.filter((v) => v !== value);
    });
  };

  const handleSimpan = async () => {
    setSubmitting(true);

    const payload = {
      answers: Object.entries(answers).map(([id, ans]) => ({
        question_id: parseInt(id, 10),
        answer: ans.jawaban || false,
        note: ans.keterangan || "",
      })),
      conclusion: kesimpulan,
      recommendation: rekomendasiLanjutan,

      paedagog: rekomendasiAssessment.includes("(PLB) Paedagog"),
      okupasi: rekomendasiAssessment.includes("Terapi Okupasi"),
      wicara: rekomendasiAssessment.includes("Terapi Wicara"),
      fisio: rekomendasiAssessment.includes("Fisioterapi"),
    };

    try {
      const res = await submitObservation(pasien.observation_id, payload);
      if ((res as any)?.success) {
        alert("✅ Observasi berhasil disimpan!");
        router.replace("/terapis/observasi/riwayat");
      } else {
        alert(`❌ Gagal menyimpan: ${(res as any)?.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error saat menyimpan:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />
        <main className="p-6 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => router.replace("/terapis/observasi")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
              <div className="w-10 h-10 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm">Memuat pertanyaan...</p>
            </div>
          ) : (
            <>
              {step === "observasi" && kategoriList.length > 0 && (
                <div className="flex justify-between items-center mb-8">
                  <div className="flex justify-start items-center gap-8 overflow-x-auto relative">
                    {kategoriList.map((k, i) => {
                      const pertanyaanKategori = groupedQuestions[k] || [];
                      const sudahDiisi = pertanyaanKategori.every(
                        (q) => answers[q.question_id]?.jawaban !== undefined
                      );
                      const isActive = activeTab === k;

                      return (
                        <div
                          key={k}
                          className="relative flex flex-col items-center flex-shrink-0"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveTab(k)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition ${
                              isActive
                                ? "bg-[#5F52BF] text-white"
                                : sudahDiisi
                                ? "bg-[#81B7A9] text-white"
                                : "bg-gray-300 text-black"
                            }`}
                          >
                            {i + 1}
                          </button>

                          {i < kategoriList.length - 1 && (
                            <div
                              className="absolute top-5 h-1"
                              style={{
                                width: "80px",
                                left: "85px",
                                backgroundColor: sudahDiisi ? "#81B7A9" : "#E0E0E0",
                              }}
                            />
                          )}

                          <span className="mt-3 text-sm font-medium text-center w-28 whitespace-nowrap">
                            {k}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-sl font-bold text-[#36315B] bg-[#E7E4FF] px-3 py-1 rounded-full shadow-sm">
                    Total Skor : {totalScore}
                  </div>
                </div>
              )}

              {/* Step Observasi */}
              {step === "observasi" && kategoriList.length > 0 && (
                <div className="space-y-6">
                  {(groupedQuestions[activeTab] || []).map((q) => (
                    <div key={q.question_id} className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="font-medium">
                        {q.question_number ?? ""}. {q.question_text}{" "}
                        <span className="text-sm text-[#36315B]">(Score {q.score})</span>
                      </p>

                      <div className="flex gap-4 mt-2 items-center">
                        <input
                          type="text"
                          placeholder="Keterangan"
                          className="border rounded-md p-2 flex-1"
                          value={answers[q.question_id]?.keterangan || ""}
                          onChange={(e) =>
                            handleChange(q.question_id, "keterangan", e.target.value)
                          }
                        />

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={`jawaban-${q.question_id}`}
                              checked={answers[q.question_id]?.jawaban === true}
                              onChange={() => handleChange(q.question_id, "jawaban", true)}
                              className="w-4 h-4 accent-[#81B7A9]"
                            />
                            Ya
                          </label>

                          <label className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={`jawaban-${q.question_id}`}
                              checked={answers[q.question_id]?.jawaban === false}
                              onChange={() => handleChange(q.question_id, "jawaban", false)}
                              className="w-4 h-4 accent-[#81B7A9]"
                            />
                            Tidak
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end items-center mt-8 gap-4">
                    {activeTab !== kategoriList[0] && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="bg-white text-[#81B7A9] px-4 py-2 rounded-md border-2 border-[#81B7A9] hover:bg-[#81B7A9] hover:text-white transition"
                      >
                        Sebelumnya
                      </button>
                    )}

                    {activeTab === kategoriList[kategoriList.length - 1] ? (
                      <button
                        type="button"
                        onClick={() => setStep("kesimpulan")}
                        className="bg-[#81B7A9] text-white px-6 py-2 rounded-md"
                      >
                        Selesai
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#81B7A9] text-white px-4 py-2 rounded-md"
                      >
                        Lanjutkan
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step Kesimpulan */}
              {step === "kesimpulan" && (
                <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
                  <h2 className="text-xl font-semibold">Isi Kesimpulan & Rekomendasi</h2>

                  <div className="flex justify-between text-sm">
                    <p>
                      <b>Pasien:</b> {pasien.nama} | {pasien.tglObservasi}
                    </p>
                    <p className="font-bold">Total Skor: {totalScore}</p>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Kesimpulan</label>
                    <textarea
                      className="w-full border rounded-md p-3"
                      rows={3}
                      value={kesimpulan}
                      onChange={(e) => setKesimpulan(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Rekomendasi Lanjutan</label>
                    <textarea
                      className="w-full border rounded-md p-3"
                      rows={3}
                      value={rekomendasiLanjutan}
                      onChange={(e) => setRekomendasiLanjutan(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Rekomendasi Assessment</label>
                    <div className="flex flex-wrap gap-6">
                      {["(PLB) Paedagog", "Terapi Okupasi", "Terapi Wicara", "Fisioterapi"].map(
                        (item) => (
                          <label key={item} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={item}
                              checked={rekomendasiAssessment.includes(item)}
                              onChange={(e) => handleAssessmentChange(item, e.target.checked)}
                              className="w-4 h-4 accent-[#81B7A9]"
                            />
                            {item}
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setStep("observasi")}
                      className="bg-white text-[#81B7A9] px-4 py-2 rounded-md border-2 border-[#81B7A9] hover:bg-[#81B7A9] hover:text-white transition"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("review")}
                      className="bg-[#81B7A9] text-white px-6 py-2 rounded-md"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              )}

              {/* Step Review */}
              {step === "review" && (
                <div className="bg-white shadow-lg rounded-lg p-8 space-y-4">
                  <h2 className="text-xl font-semibold">Review Data</h2>

                  <div className="flex justify-between text-sm">
                    <p>
                      <b>Peserta:</b> {pasien.nama} | {pasien.tglObservasi}
                    </p>
                    <p className="font-bold">Total Skor: {totalScore}</p>
                  </div>

                  <p>
                    <b>Kesimpulan:</b> {kesimpulan || "-"}
                  </p>
                  <p>
                    <b>Rekomendasi Lanjutan:</b> {rekomendasiLanjutan || "-"}
                  </p>
                  <p>
                    <b>Rekomendasi Assessment:</b>{" "}
                    {rekomendasiAssessment.length > 0
                      ? rekomendasiAssessment.join(", ")
                      : "-"}
                  </p>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setStep("kesimpulan")}
                      className="bg-white text-[#81B7A9] px-4 py-2 rounded-md border-2 border-[#81B7A9] hover:bg-[#81B7A9] hover:text-white transition"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleSimpan}
                      disabled={submitting}
                      className="bg-[#81B7A9] text-white px-6 py-2 rounded-md disabled:opacity-50"
                    >
                      {submitting ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}