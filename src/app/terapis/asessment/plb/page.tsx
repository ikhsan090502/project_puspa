"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

interface PLBAssessmentData {
  patientName: string;
  age: string;
  gender: string;
  aspekMembaca: string;
  aspekMenulis: string;
  aspekBerhitung: string;
  aspekKesiapanBelajar: string;
  aspekPengetahuanUmum: string;
}

export default function PLBAssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<PLBAssessmentData>({
    patientName: "",
    age: "",
    gender: "",
    aspekMembaca: "",
    aspekMenulis: "",
    aspekBerhitung: "",
    aspekKesiapanBelajar: "",
    aspekPengetahuanUmum: "",
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

  const handleInputChange = (field: keyof PLBAssessmentData, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!assessmentData.aspekMembaca || !assessmentData.aspekMenulis ||
        !assessmentData.aspekBerhitung || !assessmentData.aspekKesiapanBelajar ||
        !assessmentData.aspekPengetahuanUmum) {
      alert("Harap lengkapi semua aspek assessment.");
      return;
    }

    try {
      // Mock API call - in real app, send to backend
      console.log("Submitting PLB assessment:", assessmentData);
      alert("Assessment PLB berhasil disimpan!");
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
              Assessment PLB (Paedagog)
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

          {/* Aspek Membaca */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek Membaca
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Mengenal Huruf
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan mengenal huruf..."
                  value={assessmentData.aspekMembaca}
                  onChange={(e) => handleInputChange("aspekMembaca", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Membaca Kata
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan membaca kata..."
                  defaultValue="Dapat membaca kata-kata sederhana dengan baik"
                />
              </div>
            </div>
          </div>

          {/* Aspek Menulis */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek Menulis
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Menulis Huruf
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan menulis huruf..."
                  value={assessmentData.aspekMenulis}
                  onChange={(e) => handleInputChange("aspekMenulis", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Menulis Kata
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan menulis kata..."
                  defaultValue="Dapat menulis kata-kata sederhana dengan baik"
                />
              </div>
            </div>
          </div>

          {/* Aspek Berhitung */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek Berhitung
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Mengenal Angka
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan mengenal angka..."
                  value={assessmentData.aspekBerhitung}
                  onChange={(e) => handleInputChange("aspekBerhitung", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operasi Hitung Sederhana
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan operasi hitung..."
                  defaultValue="Dapat melakukan penjumlahan dan pengurangan sederhana"
                />
              </div>
            </div>
          </div>

          {/* Aspek Kesiapan Belajar */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek Kesiapan Belajar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Fokus dan Konsentrasi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan fokus..."
                  value={assessmentData.aspekKesiapanBelajar}
                  onChange={(e) => handleInputChange("aspekKesiapanBelajar", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Mengikuti Instruksi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan mengikuti instruksi..."
                  defaultValue="Dapat mengikuti instruksi sederhana dengan baik"
                />
              </div>
            </div>
          </div>

          {/* Aspek Pengetahuan Umum */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Aspek Pengetahuan Umum
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengetahuan tentang Lingkungan
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan pengetahuan tentang lingkungan..."
                  value={assessmentData.aspekPengetahuanUmum}
                  onChange={(e) => handleInputChange("aspekPengetahuanUmum", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengetahuan Sosial dan Budaya
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan pengetahuan sosial dan budaya..."
                  defaultValue="Memiliki pengetahuan dasar tentang norma sosial"
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