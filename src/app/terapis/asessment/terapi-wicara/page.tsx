"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

interface SpeechTherapyAssessmentData {
  patientName: string;
  age: string;
  gender: string;
  // Kemampuan Bahasa sections
  kemampuanBahasa1: string;
  kemampuanBahasa2: string;
  kemampuanBahasa3: string;
  kemampuanBahasa4: string;
  kemampuanBahasa5: string;
  kemampuanBahasa6: string;
  kemampuanBahasa7: string;
  kemampuanBahasa8: string;
  // Oral Motor sections
  oral1: string;
  oral2: string;
  oral3: string;
  oral4: string;
  oral5: string;
  oral6: string;
  oral7: string;
  oral8: string;
}

export default function SpeechTherapyAssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<SpeechTherapyAssessmentData>({
    patientName: "",
    age: "",
    gender: "",
    kemampuanBahasa1: "",
    kemampuanBahasa2: "",
    kemampuanBahasa3: "",
    kemampuanBahasa4: "",
    kemampuanBahasa5: "",
    kemampuanBahasa6: "",
    kemampuanBahasa7: "",
    kemampuanBahasa8: "",
    oral1: "",
    oral2: "",
    oral3: "",
    oral4: "",
    oral5: "",
    oral6: "",
    oral7: "",
    oral8: "",
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

  const handleInputChange = (field: keyof SpeechTherapyAssessmentData, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields: (keyof SpeechTherapyAssessmentData)[] = [
      'kemampuanBahasa1', 'oral1'
    ];

    const missingFields = requiredFields.filter(field => !assessmentData[field]);
    if (missingFields.length > 0) {
      alert("Harap lengkapi semua field yang wajib diisi.");
      return;
    }

    try {
      console.log("Submitting speech therapy assessment:", assessmentData);
      alert("Assessment Terapi Wicara berhasil disimpan!");
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
              Assessment Terapi Wicara
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

          {/* Kemampuan Bahasa */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Kemampuan Bahasa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 1
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kemampuan bahasa ekspresif..."
                  value={assessmentData.kemampuanBahasa1}
                  onChange={(e) => handleInputChange("kemampuanBahasa1", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 2
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi pemahaman bahasa..."
                  value={assessmentData.kemampuanBahasa2}
                  onChange={(e) => handleInputChange("kemampuanBahasa2", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 3
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kosakata..."
                  value={assessmentData.kemampuanBahasa3}
                  onChange={(e) => handleInputChange("kemampuanBahasa3", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 4
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi struktur kalimat..."
                  value={assessmentData.kemampuanBahasa4}
                  onChange={(e) => handleInputChange("kemampuanBahasa4", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 5
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi artikulasi..."
                  value={assessmentData.kemampuanBahasa5}
                  onChange={(e) => handleInputChange("kemampuanBahasa5", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 6
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi fluency..."
                  value={assessmentData.kemampuanBahasa6}
                  onChange={(e) => handleInputChange("kemampuanBahasa6", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 7
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi pragmatics..."
                  value={assessmentData.kemampuanBahasa7}
                  onChange={(e) => handleInputChange("kemampuanBahasa7", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Bahasa 8
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kemampuan komunikasi fungsional..."
                  value={assessmentData.kemampuanBahasa8}
                  onChange={(e) => handleInputChange("kemampuanBahasa8", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Oral Motor */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Oral Motor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 1
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi struktur oral..."
                  value={assessmentData.oral1}
                  onChange={(e) => handleInputChange("oral1", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 2
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi fungsi oral motor..."
                  value={assessmentData.oral2}
                  onChange={(e) => handleInputChange("oral2", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 3
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kekuatan otot oral..."
                  value={assessmentData.oral3}
                  onChange={(e) => handleInputChange("oral3", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 4
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi koordinasi oral motor..."
                  value={assessmentData.oral4}
                  onChange={(e) => handleInputChange("oral4", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 5
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi sensitivitas oral..."
                  value={assessmentData.oral5}
                  onChange={(e) => handleInputChange("oral5", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 6
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi reflek oral..."
                  value={assessmentData.oral6}
                  onChange={(e) => handleInputChange("oral6", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 7
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi pola makan/minum..."
                  value={assessmentData.oral7}
                  onChange={(e) => handleInputChange("oral7", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oral 8
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kebiasaan oral..."
                  value={assessmentData.oral8}
                  onChange={(e) => handleInputChange("oral8", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Kesimpulan dan Rekomendasi */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Kesimpulan dan Rekomendasi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kesimpulan Assessment
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                  placeholder="Kesimpulan dari assessment terapi wicara..."
                  defaultValue="Anak menunjukkan kemajuan dalam kemampuan komunikasi dengan beberapa area yang perlu diperbaiki."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rekomendasi Intervensi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                  placeholder="Rekomendasi program terapi wicara..."
                  defaultValue="Latihan artikulasi, terapi bahasa ekspresif, dan latihan oral motor"
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