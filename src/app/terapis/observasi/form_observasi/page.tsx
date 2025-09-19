"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { questions } from "@/data/observasi_data"; 
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

export default function FormObservasiPage() {
  const searchParams = useSearchParams();

  const pasien = {
    nama: searchParams.get("nama") || "",
    usia: searchParams.get("usia") || "",
    tglObservasi: searchParams.get("tglObservasi") || "",
  };

  const kategoriList = Object.keys(questions);
  const [activeTab, setActiveTab] = useState(kategoriList[0]);
  const [step, setStep] = useState<"observasi" | "kesimpulan" | "review">(
    "observasi"
  );

  const [answers, setAnswers] = useState<
    Record<string, { jawaban?: boolean; keterangan?: string }>
  >({});
  const [kesimpulan, setKesimpulan] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");
  const [observer, setObserver] = useState("");

  const handleChange = (id: string, field: string, value: string | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const totalScore = Object.entries(answers).reduce((acc, [id, ans]) => {
    if (ans.jawaban) {
      const kategori = Object.values(questions).flat();
      const q = kategori.find((q) => q.id === id);
      return acc + (q?.score || 0);
    }
    return acc;
  }, 0);

  const handleNext = () => {
    const pertanyaanKategori = questions[activeTab];
    const belumDiisi = pertanyaanKategori.some(
      (q) => answers[q.id]?.jawaban === undefined
    );

    if (belumDiisi) {
      alert("Harap isi semua jawaban di kategori ini sebelum lanjut.");
      return;
    }

    const idx = kategoriList.indexOf(activeTab);
    if (idx < kategoriList.length - 1) {
      setActiveTab(kategoriList[idx + 1]);
    }
  };

  const handlePrev = () => {
    const idx = kategoriList.indexOf(activeTab);
    if (idx > 0) setActiveTab(kategoriList[idx - 1]);
  };

  const handleReview = () => {
    const semuaPertanyaan = Object.values(questions).flat();
    const adaYangKosong = semuaPertanyaan.some(
      (q) => answers[q.id]?.jawaban === undefined
    );

    if (adaYangKosong) {
      alert("Masih ada pertanyaan yang belum dijawab.");
      return;
    }

    setStep("kesimpulan");
  };

  const handleSimpan = () => {
    if (!observer.trim()) {
      alert("Nama Observer wajib diisi.");
      return;
    }

    alert(
      "Data disimpan!\n\n" +
        JSON.stringify(
          {
            pasien,
            kesimpulan,
            rekomendasi,
            observer,
            totalScore,
            answers,
          },
          null,
          2
        )
    );
  };

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-6 overflow-y-auto">
          {step === "observasi" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  {kategoriList.map((k) => (
                    <button
                      key={k}
                      onClick={() => setActiveTab(k)}
                      className={`px-4 py-2 rounded-full text-white ${
                        activeTab === k ? "bg-[#5F52BF]" : "bg-[#81B7A9]"
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div className="font-bold text-lg">
                  Total Skor: {totalScore}
                </div>
              </div>

              <div className="space-y-6">
                {questions[activeTab].map((q) => (
                  <div key={q.id}>
                    <p className="font-medium">
                      {q.text} (Score {q.score})
                    </p>

                    <div className="flex gap-4 mt-2">
                      <input
                        type="text"
                        placeholder="Keterangan"
                        className="border rounded-md p-2 flex-1"
                        value={answers[q.id]?.keterangan || ""}
                        onChange={(e) =>
                          handleChange(q.id, "keterangan", e.target.value)
                        }
                      />

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={answers[q.id]?.jawaban === true}
                            onChange={() => handleChange(q.id, "jawaban", true)}
                          />
                          Ya
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={answers[q.id]?.jawaban === false}
                            onChange={() =>
                              handleChange(q.id, "jawaban", false)
                            }
                          />
                          Tidak
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end items-center mt-6 gap-4">
                {activeTab !== kategoriList[0] && (
                  <button
                    onClick={handlePrev}
                    className="bg-white text-[#81B7A9] px-4 py-2 rounded-md border-2 border-[#81B7A9] hover:bg-[#81B7A9] hover:text-white transition"
                  >
                    Sebelumnya
                  </button>
                )}
                {activeTab === kategoriList[kategoriList.length - 1] ? (
                  <button
                    onClick={handleReview}
                    className="bg-[#81B7A9] text-white px-6 py-2 rounded-md"
                  >
                    Selesai
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-[#81B7A9] text-white px-4 py-2 rounded-md"
                  >
                    Lanjutkan
                  </button>
                )}
              </div>
            </>
          )}

          {step === "kesimpulan" && (
            <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold italic text-[#36315B]">
                Silahkan isi Kesimpulan & Rekomendasi
              </h2>

              <div className="flex justify-between text-sm">
                <p>
                  Peserta: <b>{pasien.nama}</b> | {pasien.tglObservasi} | Usia:{" "}
                  {pasien.usia}
                </p>
                <p className="font-bold">Total Skor: {totalScore}</p>
              </div>

              <div>
                <label className="block font-medium">Kesimpulan</label>
                <textarea
                  className="w-full border rounded-md p-2"
                  rows={3}
                  value={kesimpulan}
                  onChange={(e) => setKesimpulan(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium">Rekomendasi Lanjutan</label>
                <textarea
                  className="w-full border rounded-md p-2"
                  rows={3}
                  value={rekomendasi}
                  onChange={(e) => setRekomendasi(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep("review")}
                  className="bg-[#81B7A9] text-white px-4 py-2 rounded-md"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold italic text-[#36315B]">
                Review Data Observasi
              </h2>

              <div className="flex justify-between text-sm">
                <p>
                  Peserta: <b>{pasien.nama}</b> | {pasien.tglObservasi} | Usia:{" "}
                  {pasien.usia}
                </p>
                <p className="font-bold">Total Skor: {totalScore}</p>
              </div>

              <p>
                <b>Kesimpulan:</b> {kesimpulan}
              </p>
              <p>
                <b>Rekomendasi:</b> {rekomendasi}
              </p>

              <div>
                <label className="block font-medium">Nama Observer</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={observer}
                  onChange={(e) => setObserver(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSimpan}
                  className="bg-[#81B7A9] text-white px-4 py-2 rounded-md"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
