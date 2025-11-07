"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

interface PhysiotherapyAssessmentData {
  patientName: string;
  age: string;
  gender: string;
  // Pengumpulan Data Pasien
  keluhanUtama: string;
  riwayatPenyakit: string;
  riwayatCedera: string;
  // Pemeriksaan Umum
  kondisiUmum: string;
  postur: string;
  polaGerak: string;
  // Pemeriksaan Khusus
  kekuatanOtot: string;
  spastisitas: string;
  jenisSpastisitas: string;
  laxity: string;
  palpasiOtot: string;
  reflek: string;
  sensori: string;
  testFungsiBermain: string;
  // Diagnosis
  impairment: string;
}

export default function PhysiotherapyAssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<PhysiotherapyAssessmentData>({
    patientName: "",
    age: "",
    gender: "",
    keluhanUtama: "",
    riwayatPenyakit: "",
    riwayatCedera: "",
    kondisiUmum: "",
    postur: "",
    polaGerak: "",
    kekuatanOtot: "",
    spastisitas: "",
    jenisSpastisitas: "",
    laxity: "",
    palpasiOtot: "",
    reflek: "",
    sensori: "",
    testFungsiBermain: "",
    impairment: "",
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

  const handleInputChange = (field: keyof PhysiotherapyAssessmentData, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields: (keyof PhysiotherapyAssessmentData)[] = [
      'keluhanUtama', 'riwayatPenyakit', 'kondisiUmum', 'kekuatanOtot', 'spastisitas', 'impairment'
    ];

    const missingFields = requiredFields.filter(field => !assessmentData[field]);
    if (missingFields.length > 0) {
      alert("Harap lengkapi semua field yang wajib diisi.");
      return;
    }

    try {
      console.log("Submitting physiotherapy assessment:", assessmentData);
      alert("Assessment Fisioterapi berhasil disimpan!");
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
              Assessment Fisioterapi
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

          {/* 1. Pengumpulan Data Pasien */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              1. Pengumpulan Data Pasien
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keluhan Utama
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan keluhan utama pasien..."
                  value={assessmentData.keluhanUtama}
                  onChange={(e) => handleInputChange("keluhanUtama", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riwayat Penyakit
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Riwayat penyakit sebelumnya..."
                  value={assessmentData.riwayatPenyakit}
                  onChange={(e) => handleInputChange("riwayatPenyakit", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riwayat Cedera
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Riwayat cedera atau trauma..."
                  value={assessmentData.riwayatCedera}
                  onChange={(e) => handleInputChange("riwayatCedera", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 2. Pemeriksaan - Anamnesia Sistem */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              2. Pemeriksaan - Anamnesia Sistem
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sistem Muskuloskeletal
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Evaluasi sistem muskuloskeletal..."
                  defaultValue="Normal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sistem Saraf
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Evaluasi sistem saraf..."
                  defaultValue="Ada indikasi spastisitas"
                />
              </div>
            </div>
          </div>

          {/* 2. Pemeriksaan Umum */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              2. Pemeriksaan Umum
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kondisi Umum
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kondisi umum pasien..."
                  value={assessmentData.kondisiUmum}
                  onChange={(e) => handleInputChange("kondisiUmum", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postur
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi postur tubuh..."
                  value={assessmentData.postur}
                  onChange={(e) => handleInputChange("postur", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pola Gerak
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan pola gerak..."
                  value={assessmentData.polaGerak}
                  onChange={(e) => handleInputChange("polaGerak", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 2. Pemeriksaan Khusus */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              2. Pemeriksaan Khusus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kekuatan Otot
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kekuatan otot..."
                  value={assessmentData.kekuatanOtot}
                  onChange={(e) => handleInputChange("kekuatanOtot", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spastisitas
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi spastisitas..."
                  value={assessmentData.spastisitas}
                  onChange={(e) => handleInputChange("spastisitas", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Spastisitas
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Jenis spastisitas yang ditemukan..."
                  value={assessmentData.jenisSpastisitas}
                  onChange={(e) => handleInputChange("jenisSpastisitas", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Laxity
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi laxity..."
                  value={assessmentData.laxity}
                  onChange={(e) => handleInputChange("laxity", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palpasi Otot
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Hasil palpasi otot..."
                  value={assessmentData.palpasiOtot}
                  onChange={(e) => handleInputChange("palpasiOtot", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reflek
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi reflek..."
                  value={assessmentData.reflek}
                  onChange={(e) => handleInputChange("reflek", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sensori
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi fungsi sensori..."
                  value={assessmentData.sensori}
                  onChange={(e) => handleInputChange("sensori", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Fungsi Bermain
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Evaluasi kemampuan bermain..."
                  value={assessmentData.testFungsiBermain}
                  onChange={(e) => handleInputChange("testFungsiBermain", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 3. Diagnosis Fisioterapi */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              3. Diagnosis Fisioterapi - Impairment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impairment yang Ditemukan
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                  placeholder="Deskripsikan impairment yang ditemukan..."
                  value={assessmentData.impairment}
                  onChange={(e) => handleInputChange("impairment", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rekomendasi Intervensi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
                  placeholder="Rekomendasi intervensi fisioterapi..."
                  defaultValue="Terapi latihan kekuatan otot, peregangan, dan latihan keseimbangan"
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