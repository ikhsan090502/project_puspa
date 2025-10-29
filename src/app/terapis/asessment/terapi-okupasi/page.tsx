"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

interface OccupationalTherapyAssessmentData {
  patientName: string;
  age: string;
  gender: string;
  // Assessment sections based on images
  penilaianUmum: string;
  aspekA: string; // Aktivitas sehari-hari
  aspekB: string; // Bermain
  aspekC: string; // Komunikasi
  aspekD: string; // Kemandirian
  aspekI: string; // Interaksi sosial
  hasilOkupasi: string;
}

export default function OccupationalTherapyAssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<OccupationalTherapyAssessmentData>({
    patientName: "",
    age: "",
    gender: "",
    penilaianUmum: "",
    aspekA: "",
    aspekB: "",
    aspekC: "",
    aspekD: "",
    aspekI: "",
    hasilOkupasi: "",
  });

  useEffect(() => {
    const patient = searchParams.get("patient") || "";
    const usia = searchParams.get("usia") || "";
    const jenisKelamin = searchParams.get("jenisKelamin") || "";

    setAssessmentData(prev => ({
      ...prev,
      patientName: patient,
      age: usia,
      gender: jenisKelamin,
    }));
    setLoading(false);
  }, [searchParams]);

  const handleInputChange = (field: keyof OccupationalTherapyAssessmentData, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields: (keyof OccupationalTherapyAssessmentData)[] = [
      'penilaianUmum', 'aspekA', 'aspekB', 'hasilOkupasi'
    ];

    const missingFields = requiredFields.filter(field => !assessmentData[field]);
    if (missingFields.length > 0) {
      alert("Harap lengkapi semua field yang wajib diisi.");
      return;
    }

    try {
      console.log("Submitting occupational therapy assessment:", assessmentData);
      alert("Assessment Terapi Okupasi berhasil disimpan!");
      router.push("/terapis/asessment");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Terjadi kesalahan saat menyimpan assessment.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memuat assessment...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Assessment Terapi Okupasi
            </h1>
            <button
              onClick={() => router.push("/terapis/asessment")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Informasi Pasien
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pasien
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{assessmentData.patientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usia
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{assessmentData.age}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{assessmentData.gender}</p>
              </div>
            </div>
          </div>

          {/* Penilaian */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Penilaian
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penilaian Umum
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                  placeholder="Deskripsikan penilaian umum terhadap kemampuan okupasi anak..."
                  value={assessmentData.penilaianUmum}
                  onChange={(e) => handleInputChange("penilaianUmum", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Aspek A - Aktivitas Sehari-hari */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek A - Aktivitas Sehari-hari
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan dalam Aktivitas Sehari-hari
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kemampuan makan, berpakaian, mandi, dll..."
                  value={assessmentData.aspekA}
                  onChange={(e) => handleInputChange("aspekA", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Kemandirian
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Seberapa mandiri anak dalam aktivitas sehari-hari..."
                  defaultValue="Perlu bantuan minimal untuk beberapa aktivitas"
                />
              </div>
            </div>
          </div>

          {/* Aspek B - Bermain */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek B - Bermain
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bermain
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kemampuan bermain dan interaksi dengan mainan..."
                  value={assessmentData.aspekB}
                  onChange={(e) => handleInputChange("aspekB", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Permainan yang Disukai
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Mainan atau jenis permainan yang anak sukai..."
                  defaultValue="Menyukai mainan edukatif dan puzzle"
                />
              </div>
            </div>
          </div>

          {/* Aspek C - Komunikasi */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek C - Komunikasi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Komunikasi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kemampuan komunikasi verbal dan non-verbal..."
                  value={assessmentData.aspekC}
                  onChange={(e) => handleInputChange("aspekC", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respons terhadap Komunikasi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Bagaimana anak merespons komunikasi dari orang lain..."
                  defaultValue="Responsif terhadap komunikasi verbal dan gestur"
                />
              </div>
            </div>
          </div>

          {/* Aspek D - Kemandirian */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek D - Kemandirian
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Kemandirian
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi tingkat kemandirian anak..."
                  value={assessmentData.aspekD}
                  onChange={(e) => handleInputChange("aspekD", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area yang Perlu Bantuan
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Area-area yang masih memerlukan bantuan..."
                  defaultValue="Perlu bantuan dalam mengancingkan baju dan mengikat tali sepatu"
                />
              </div>
            </div>
          </div>

          {/* Aspek I - Interaksi Sosial */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek I - Interaksi Sosial
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Interaksi Sosial
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kemampuan berinteraksi dengan orang lain..."
                  value={assessmentData.aspekI}
                  onChange={(e) => handleInputChange("aspekI", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hubungan dengan Teman Sebaya
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Kualitas hubungan dengan teman sebaya..."
                  defaultValue="Dapat berinteraksi dengan baik dengan teman sebaya"
                />
              </div>
            </div>
          </div>

          {/* Hasil Okupasi */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Hasil Okupasi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kesimpulan Assessment
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                  placeholder="Kesimpulan dari assessment terapi okupasi..."
                  value={assessmentData.hasilOkupasi}
                  onChange={(e) => handleInputChange("hasilOkupasi", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rekomendasi Intervensi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                  placeholder="Rekomendasi intervensi terapi okupasi..."
                  defaultValue="Latihan kemandirian, terapi bermain, dan latihan interaksi sosial"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Simpan Assessment
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}