"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import oralFasial from "@/data/wicaraOral.json";
import kemampuanBahasa from "@/data/wicaraKemampuanbahasa.json";
import { submitAssessment, completeAssessment } from "@/lib/api/asesment";

const AsesmenPage = () => {
  const tabs = ["Oral Fasial", "Kemampuan Bahasa"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openSection, setOpenSection] = useState<number | null>(0);

  const [responses, setResponses] = useState<{ [key: string]: string | string[] }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const data = activeTab === "Oral Fasial" ? oralFasial : kemampuanBahasa;

  // 🔹 Handle jawaban
  const handleResponse = (questionKey: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleCheck = (questionKey: string, value: string) => {
    setResponses((prev) => {
      const prevValues = Array.isArray(prev[questionKey]) ? prev[questionKey] : [];
      if (prevValues.includes(value)) {
        return { ...prev, [questionKey]: prevValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [questionKey]: [...prevValues, value] };
      }
    });
  };

  const handleNoteChange = (questionKey: string, value: string) => {
    setNotes((prev) => ({ ...prev, [questionKey]: value }));
  };

  // 🔹 Cek apakah section sudah selesai
  const isSectionComplete = (section: any) => {
    if (activeTab === "Oral Fasial") {
      return section.questions.every((q: any) => {
        const qKey = `${section.title}-${q.label}`;
        const response = responses[qKey];
        return (
          (typeof response === "string" && response.length > 0) ||
          (Array.isArray(response) && response.length > 0)
        );
      });
    } else {
      let totalChecked = 0;
      section.questions.forEach((q: any) => {
        const qKey = `${section.title}-${q.label}`;
        const response = responses[qKey];
        if (Array.isArray(response) && response.length > 0) totalChecked += 1;
      });
      return totalChecked >= 2;
    }
  };

  // ====================== 🔹 HANDLE SUBMIT ======================
  const handleSubmit = async () => {
    setLoading(true);


    const payload = {
      // === contoh payload sesuai BE ===
      face_symmetry: "normal",
      face_symmetry_note: null,
      face_abnormal_movement: "none",
      face_abnormal_movement_note: null,
      face_muscle_flexation: "ya",
      face_muscle_flexation_note: "Fleksi otot wajah normal",
      jaw_range_of_motion: "normal",
      jaw_range_of_motion_note: "Bisa membuka mulut lebar",
      jaw_symmetry: "normal",
      jaw_symmetry_note: null,
      jaw_movement: "normal",
      jaw_movement_note: null,
      jaw_tmj_noises: "absent",
      jaw_tmj_noises_note: null,

      dental_occlusion: "neutrocclusion (Class I)",
      dental_occlusion_note: null,
      dental_occlusion_taring: "normal",
      dental_occlusion_taring_note: null,
      dental_teeth: "semua ada",
      dental_teeth_note: null,
      dental_arrangement: "normal",
      dental_arrangement_note: null,
      dental_cleanliness: "bersih",
      dental_cleanliness_note: null,

      lip_pouting_range_of_motion: "normal",
      lip_pouting_range_of_motion_note: null,
      lip_pouting_symmetry: "normal",
      lip_pouting_symmetry_note: null,
      lip_pouting_tongue_strength: "normal",
      lip_pouting_tongue_strength_note: null,
      lip_pouting_other_note: "Bibir dapat dimonyongkan dengan baik",

      lip_smilling_range_of_motion: "normal",
      lip_smilling_range_of_motion_note: null,
      lip_smilling_symmetry: "normal",
      lip_smilling_symmetry_note: null,
      lip_smilling_other_note: "Senyum simetris, tidak ada deviasi",

      tongue_color: "normal",
      tongue_color_note: null,
      tongue_abnormal_movement: "tidak ada",
      tongue_abnormal_movement_note: null,
      tongue_size: "normal",
      tongue_size_note: null,
      tongue_frenulum: "normal",
      tongue_frenulum_note: null,
      tongue_other_note: null,

      tongue_out_symmetry: "normal",
      tongue_out_symmetry_note: null,
      tongue_out_range_of_motion: "normal",
      tongue_out_range_of_motion_note: null,
      tongue_out_speed: "normal",
      tongue_out_speed_note: null,
      tongue_out_strength: "normal",
      tongue_out_strength_note: null,
      tongue_out_other_note: "Lidah keluar lurus, tidak tremor",

      tongue_pull_symmetry: "normal",
      tongue_pull_symmetry_note: null,
      tongue_pull_range_of_motion: "normal",
      tongue_pull_range_of_motion_note: null,
      tongue_pull_speed: "normal",
      tongue_pull_speed_note: null,
      tongue_pull_other_note: null,

      tongue_to_right_range_of_motion: "normal",
      tongue_to_right_range_of_motion_note: null,
      tongue_to_right_strength: "normal",
      tongue_to_right_strength_note: null,
      tongue_to_right_other_note: null,

      tongue_to_left_range_of_motion: "normal",
      tongue_to_left_range_of_motion_note: null,
      tongue_to_left_strength: "normal",
      tongue_to_left_strength_note: null,
      tongue_to_left_other_note: null,

      tongue_to_bottom_movement: "normal",
      tongue_to_bottom_movement_note: null,
      tongue_to_bottom_range_of_motion: "normal",
      tongue_to_bottom_range_of_motion_note: null,
      tongue_to_bottom_other_note: null,

      tongue_to_upper_movement: "normal",
      tongue_to_upper_movement_note: null,
      tongue_to_upper_range_of_motion: "normal",
      tongue_to_upper_range_of_motion_note: null,
      tongue_to_upper_other_note: null,

      tongue_to_left_right_movement: "normal",
      tongue_to_left_right_movement_note: null,
      tongue_to_left_right_range_of_motion: "normal",
      tongue_to_left_right_range_of_motion_note: null,
      tongue_to_left_right_other_note: "Gerakan bergantian cepat dan akurat",

      pharynx_color: "normal",
      pharynx_color_note: null,
      pharynx_tonsil: "normal",
      pharynx_tonsil_note: null,
      pharynx_other_note: null,

      palate_color: "normal",
      palate_color_note: null,
      palate_rugae: "ada",
      palate_rugae_note: null,
      palate_hard_height: "normal",
      palate_hard_height_note: null,
      palate_hard_width: "normal",
      palate_hard_width_note: null,
      palate_growths: "tidak ada",
      palate_growths_note: null,
      palate_fistula: "tidak ada",
      palate_fistula_note: null,
      palate_soft_symmetry_at_rest: "normal",
      palate_soft_symmetry_at_rest_note: null,
      palate_gag_reflex: "normal",
      palate_gag_reflex_note: null,
      palate_other_note: null,

      palate_phonation_symmetry: "normal",
      palate_phonation_symmetry_note: null,
      palate_posterior_movement: "ada",
      palate_posterior_movement_note: null,
      palate_uvula_position: "normal",
      palate_uvula_position_note: null,
      palate_nasal_leak: "tidak ada",
      palate_nasal_leak_note: null,
      palate_phonation_other_note: "Bunyi jelas, tanpa nasalitas",

      age_category: "4-5 Tahun",
      answers: [
        { skill: "Mengucapkan nama lengkap", checked: true },
        { skill: "Menyebutkan warna", checked: false },
      ],
    };

    try {
      console.log("=== SUBMIT PAYLOAD ===", payload);
      const res = await submitAssessment("1", "wicara", payload);
      console.log("✅ SUCCESS:", res);

      // 🔹 ubah status menjadi completed setelah submit sukses
      await completeAssessment("1", "wicara");
      console.log("✅ Status pasien diubah ke completed");

      // 🔹 tampilkan popup sukses
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("❌ Gagal submit:", error);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1">
        <HeaderTerapis />
        <div className="p-6">
          {/* 🔹 Info awal */}
          {activeTab === "Oral Fasial" && (
            <div className="bg-white p-4 rounded-xl mb-8 text-[#36315B] shadow-md">
              <strong>Instruksi:</strong> Beri tanda cek pada sebelah kiri apabila Anda melakukan pengamatan
              dan lingkari sesuai dengan pengamatan Anda, kemudian berikan keterangan pada sebelah kanan.
            </div>
          )}

          {/* 🔹 Tab navigasi */}
          <div className="flex gap-3 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setOpenSection(null);
                }}
                className={`px-5 py-2 font-medium transition ${
                  activeTab === tab
                    ? "border-b-4 border-[#409E86] text-[#409E86]"
                    : "text-[#36315B] hover:text-[#409E86]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 🔹 Section */}
          {data.map((section, i) => {
            const complete = isSectionComplete(section);
            return (
              <div key={i} className="mb-6 rounded-2xl bg-white shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === i ? null : i)}
                  className={`w-full flex justify-between items-center px-5 py-4 text-left transition 
                    ${complete ? "bg-[#36315B] text-white" : "bg-[#C0DCD6] text-[#36315B]"}`}
                >
                  <span className="font-semibold">{section.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openSection === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openSection === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-5 space-y-6"
                    >
                      {section.questions.map((q: any, j: number) => {
                        const qKey = `${section.title}-${q.label}`;
                        return activeTab === "Oral Fasial" ? (
                          <div
                            key={j}
                            className="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-100 pb-4"
                          >
                            <div className="md:w-2/3">
                              <p className="text-gray-700 font-medium text-sm mb-2">{q.label}:</p>
                              <div className="flex flex-col gap-2">
                                {q.options?.map((opt: string, k: number) => (
                                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="radio"
                                      name={qKey}
                                      value={opt}
                                      checked={responses[qKey] === opt}
                                      onChange={() => handleResponse(qKey, opt)}
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="md:w-1/3">
                              <input
                                type="text"
                                placeholder="Keterangan..."
                                value={notes[qKey] || ""}
                                onChange={(e) => handleNoteChange(qKey, e.target.value)}
                                className="w-full border rounded-lg p-2 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <div key={j} className="flex items-start gap-3 border-b border-gray-100 pb-2">
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(responses[qKey]) && responses[qKey].includes(q.label)
                              }
                              onChange={() => handleCheck(qKey, q.label)}
                            />
                            <p className="text-gray-700 text-sm">{q.label}</p>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* 🔹 Tombol Simpan */}
          <div className="flex justify-end mt-6 gap-3">
            {activeTab === "Oral Fasial" ? (
              <>
                <button className="bg-gray-200 text-[#36315B] px-6 py-2 rounded-xl">Simpan</button>
                <button
                  className="bg-[#36315B] text-white px-6 py-2 rounded-xl"
                  onClick={() => setActiveTab("Kemampuan Bahasa")}
                >
                  Lanjut
                </button>
              </>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded-xl text-white ${
                  loading ? "bg-gray-400" : "bg-[#36315B] hover:bg-[#81B7A9]"
                }`}
              >
                {loading ? "Mengirim..." : "Simpan"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 POPUP SUKSES */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold text-[#36315B] mb-2">✅ Data Berhasil Dikirim!</h2>
            <p className="text-gray-600 mb-4">Pasien telah dipindahkan ke daftar <b>Selesai</b>.</p>
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
};

export default AsesmenPage;