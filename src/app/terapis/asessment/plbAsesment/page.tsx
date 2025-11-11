"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { submitAssessment } from "@/lib/api/asesment";
import questions from "@/data/plbQuestions.json";

type Answer = { desc?: string; score?: number };
type QuestionsData = Record<string, string[]>; // aspek -> array pertanyaan
type AnswersState = Record<string, Record<number, Answer>>;

const penilaianOptions = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

// 🧩 Mapping pertanyaan → key backend
const fieldMapping: Record<string, string> = {
  // 📘 Membaca
  "Anak mampu mengenal huruf": "recognize_letters",
  "Anak mampu mengenal simbol huruf": "recognize_letter_symbols",
  "Anak mampu menyebutkan huruf A-Z secara berurutan": "say_alphabet_in_order",
  "Anak mampu mengucapkan huruf yang tepat dan benar": "pronounce_letters_correctly",
  "Anak mampu membaca bunyi vokal (a,i,u,e,o)": "read_vowels",
  "Anak mampu membaca bunyi konsonan (b,c,d,f,g,h,j,k,l,m,n,p,q,r,s,t,v,w,x,z)": "read_consonants",
  "Anak mampu membaca kata yang diminta": "read_given_words",
  "Anak mampu membaca kalimat": "read_sentences",
  "Anak mampu membaca sepintas/cepat": "read_quickly",
  "Anak mampu membaca isi bacaan": "read_for_comprehension",

  // ✏️ Menulis
  "Anak mampu memegang alat tulis": "hold_writing_tool",
  "Anak mampu menulis garis lurus keatas kebawah": "write_straight_down",
  "Anak mampu menulis garis lurus kekanan kekiri": "write_straight_side",
  "Anak mampu menulis garis melingkar": "write_curved_line",
  "Anak mampu menulis huruf dengan lurus": "write_letters_straight",
  "Anak mampu menyalin huruf": "copy_letters",
  "Anak mampu menulis namanya sendiri": "write_own_name",
  "Anak mampu mengenal dan menulis kata atau kalimat yang diminta": "recognize_and_write_words",
  "Anak mampu mengenal dan menulis huruf besar atau huruf kecil alfabet": "write_upper_lower_case",
  "Anak mampu membedakan huruf dengan kesamaan bentuk (b,d,p,q atau m,n,w)": "differentiate_similar_letters",
  "Anak mampu membuat kalimat sederhana": "write_simple_sentences",
  "Anak mampu menulis cerita berdasarkan gambar": "write_story_from_picture",

  // 🔢 Berhitung
  "Anak mampu mengenal bentuk angka 1-10 dengan urut": "recognize_numbers_1_10",
  "Anak mampu menghitung benda konkret (1-50)": "count_concrete_objects",
  "Anak mampu memahami perbandingan banyak sedikit angka": "compare_quantities",
  "Anak mampu mengenal tanda operasi hitung bilangan (+,-,x,:)": "recognize_math_symbols",
  "Anak mampu mengoperasikan hitung bilangan penjumlahan dan pengurangan": "operate_addition_subtraction",
  "Anak mampu mengoperasikan hitung bilangan perkalian dan pembagian": "operate_multiplication_division",
  "Anak mampu mengoperasikan alat bantu hitung": "use_counting_tools",

  // 🧠 Kesiapan Belajar
  "Anak mampu mengikuti instruksi (konsentrasi)": "follow_instructions",
  "Anak mampu duduk dalam waktu yang ditentukan untuk mengikuti instruksi guru": "sit_calmly",
  "Anak bergerak aktif tidak dapat duduk tenang": "not_hyperactive",
  "Anak menunjukkan inisiasi (tidak pasif) dalam belajar": "show_initiative",
  "Anak bersikap kooperatif": "is_cooperative",
  "Anak menunjukkan sikap antusias (mood) dalam belajar": "show_enthusiasm",
  "Anak mampu menyelesaikan tugas sampai tuntas": "complete_tasks",

  // 🌈 Pengetahuan Umum
  "Anak mengetahui identitas diri": "knows_identity",
  "Anak menunjukkan anggota tubuh": "show_body_parts",
  "Anak memiliki pemahaman perbedaan rasa pada indera pengecapan": "understand_taste_differences",
  "Anak mampu mengidentifikasikan warna": "identify_colors",
  "Anak mampu memahami besar kecil, berat ringan, luas sempit": "understand_sizes",
  "Anak mampu memahami orientasi waktu (pagi, siang, malam, jam, hari, bulan, tahun)": "understand_orientation",
  "Anak mampu mengekspresikan wajah (emosi)": "express_emotions"
};

// 🔧 Fungsi mapping jawaban → payload backend
function mapAnswersToPayload(
  answers: Record<string, { score: number; desc: string }>,
  summary: string
): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const [questionText, answer] of Object.entries(answers)) {
    const key = fieldMapping[questionText];
    if (key) {
      payload[`${key}_score`] = answer.score;
      payload[`${key}_desc`] = answer.desc;
    } else {
      console.warn("⚠️ Pertanyaan belum ada di mapping:", questionText);
    }
  }
  payload.summary = summary;
  return payload;
}

export default function PLBAssessmentPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = "paedagog";
  const allQuestions: QuestionsData = questions;

  const aspekTabs = Object.keys(allQuestions);
  const [activeAspek, setActiveAspek] = useState(aspekTabs[0]);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [kesimpulan, setKesimpulan] = useState("");
  const [loading, setLoading] = useState(false);

  // Validasi kelengkapan
  const validationStatus = useMemo(() => {
    const status: Record<string, "complete" | "incomplete"> = {};
    aspekTabs.forEach((aspek) => {
      const total = allQuestions[aspek].length;
      const answered = Object.values(answers[aspek] || {}).filter(
        (a) => a.score !== undefined
      ).length;
      status[aspek] = answered >= total ? "complete" : "incomplete";
    });
    return status;
  }, [answers, aspekTabs, allQuestions]);

  // Input keterangan
  const handleDescChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [activeAspek]: {
        ...prev[activeAspek],
        [index]: { ...prev[activeAspek]?.[index], desc: value },
      },
    }));
  };

  // Input nilai
  const handleScoreSelect = (index: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [activeAspek]: {
        ...prev[activeAspek],
        [index]: { ...prev[activeAspek]?.[index], score: value },
      },
    }));
    setOpenDropdown(null);
  };

  // Submit
  const handleSubmit = async () => {
    if (!assessmentId) return alert("❌ assessment_id tidak ditemukan");

    const allComplete = Object.values(validationStatus).every((v) => v === "complete");
    if (!allComplete) return alert("❌ Lengkapi semua penilaian dulu!");

    // Gabungkan semua jawaban dari semua aspek
    const flatAnswers: Record<string, { score: number; desc: string }> = {};
    for (const aspek of aspekTabs) {
      const qList = allQuestions[aspek];
      Object.entries(answers[aspek] || {}).forEach(([idx, val]) => {
        flatAnswers[qList[Number(idx)]] = {
          score: val.score ?? 0,
          desc: val.desc ?? "",
        };
      });
    }

    const payload = mapAnswersToPayload(flatAnswers, kesimpulan);

    try {
      setLoading(true);
      await submitAssessment(assessmentId, type, payload);
      alert("✅ Penilaian berhasil disimpan!");
    } catch (err: any) {
      alert("❌ Gagal menyimpan data: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const currentQuestions = allQuestions[activeAspek] || [];
  const isLast = aspekTabs.indexOf(activeAspek) === aspekTabs.length - 1;
  const isFirst = aspekTabs.indexOf(activeAspek) === 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />
        <main className="flex-1 p-6 flex flex-col overflow-hidden">
          <h1 className="text-2xl font-bold text-[#36315B] mb-4 text-center">
            PLB | Aspek {activeAspek}
          </h1>

          {/* Tab Aspek */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {aspekTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAspek(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeAspek === tab
                    ? "bg-[#81B7A9]/20 border-[#81B7A9] text-[#36315B]"
                    : validationStatus[tab] === "complete"
                    ? "bg-[#36315B] text-white border-[#36315B]"
                    : "text-[#36315B]/70 hover:bg-gray-100 border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Daftar Pertanyaan */}
          <div className="bg-white rounded-xl shadow-sm flex-1 overflow-y-auto p-6">
            {currentQuestions.map((q, i) => {
              const current = answers[activeAspek]?.[i];
              return (
                <div key={i} className="mb-6 pb-5 bg-white rounded-xl shadow-md p-4">
                  <p className="font-semibold mb-3 text-[#36315B]">{i + 1}. {q}</p>
                  <div className="flex items-center gap-4">
                    <input
                      placeholder="Keterangan"
                      className="flex-1 border border-gray-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[#81B7A9]"
                      value={current?.desc || ""}
                      onChange={(e) => handleDescChange(i, e.target.value)}
                    />
                    <div className="relative w-40">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                        className="flex justify-between items-center w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[#36315B] bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        {penilaianOptions.find((opt) => opt.value === current?.score)?.label || "Penilaian"}
                        <ChevronDown size={16} className={`ml-2 transition-transform ${openDropdown === i ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {openDropdown === i && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-50"
                          >
                            {penilaianOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleScoreSelect(i, opt.value)}
                                className="block w-full text-left px-4 py-2 text-sm text-[#36315B] hover:bg-[#81B7A9]/20"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Kesimpulan */}
            {isLast && (
              <div className="mt-10 border-t pt-6">
                <h2 className="font-bold text-[#36315B] mb-3">Kesimpulan Assessment</h2>
                <textarea
                  placeholder="Tulis kesimpulan di sini ..."
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#81B7A9]"
                  value={kesimpulan}
                  onChange={(e) => setKesimpulan(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Navigasi */}
          <div className="flex justify-between mt-6">
            <button
              disabled={isFirst}
              onClick={() => setActiveAspek(aspekTabs[aspekTabs.indexOf(activeAspek) - 1])}
              className="px-6 py-2 rounded-lg font-semibold text-[#81B7A9] border border-[#81B7A9] disabled:opacity-50"
            >
              &larr; Sebelumnya
            </button>
            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                  loading ? "bg-gray-400" : "bg-[#36315B] hover:bg-[#2E284E]"
                }`}
              >
                {loading ? "Menyimpan..." : "Simpan & Selesai"}
              </button>
            ) : (
              <button
                onClick={() => setActiveAspek(aspekTabs[aspekTabs.indexOf(activeAspek) + 1])}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-[#81B7A9] hover:bg-[#6EA092]"
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
