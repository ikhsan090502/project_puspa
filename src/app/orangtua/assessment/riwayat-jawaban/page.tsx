"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

interface AssessmentHistory {
  id: string;
  nama: string;
  terapi: string;
  tanggalAssessment: string;
  hasilAssessment: string;
  rekomendasi: string;
}

export default function RiwayatJawabanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [assessmentHistories, setAssessmentHistories] = useState<AssessmentHistory[]>([]);
  const [selectedTherapy, setSelectedTherapy] = useState<string>("semua");

  const selectedChildrenIds = searchParams.get("children")?.split(",") || [];

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch("/api/proxy/auth/protected", { credentials: "include" });
        const data = await res.json();

        if (!data?.success || data?.data?.role !== "orangtua") {
          router.replace("/auth/login");
        } else {
          // Mock data for assessment histories
          const mockHistories: AssessmentHistory[] = [
            {
              id: "1",
              nama: "Ananda",
              terapi: "Fisioterapi",
              tanggalAssessment: "2024-01-15",
              hasilAssessment: "Anak menunjukkan peningkatan kekuatan otot dan koordinasi gerak",
              rekomendasi: "Lanjutkan terapi fisioterapi 2x seminggu"
            },
            {
              id: "2",
              nama: "Ananda",
              terapi: "Terapi Okupasi",
              tanggalAssessment: "2024-01-20",
              hasilAssessment: "Kemampuan aktivitas sehari-hari meningkat, namun masih perlu bantuan untuk beberapa tugas",
              rekomendasi: "Fokus pada latihan kemandirian dan terapi sensori"
            },
            {
              id: "3",
              nama: "Ananda",
              terapi: "Terapi Wicara",
              tanggalAssessment: "2024-01-25",
              hasilAssessment: "Pemahaman bahasa baik, namun artikulasi beberapa kata masih perlu diperbaiki",
              rekomendasi: "Latihan artikulasi dan ekspresi bahasa sehari-hari"
            },
            {
              id: "4",
              nama: "Ananda",
              terapi: "PLB (Paedagog)",
              tanggalAssessment: "2024-02-01",
              hasilAssessment: "Kemampuan membaca dan menulis sesuai dengan usia, matematika perlu perhatian lebih",
              rekomendasi: "Latihan matematika dasar dan penguatan konsep bilangan"
            }
          ];
          setAssessmentHistories(mockHistories);
          setLoading(false);
        }
      } catch (e) {
        router.replace("/auth/login");
      }
    }

    validate();
  }, [router]);

  const filteredHistories = selectedTherapy === "semua"
    ? assessmentHistories
    : assessmentHistories.filter(history => history.terapi.toLowerCase().includes(selectedTherapy.toLowerCase()));

  const therapyOptions = ["semua", "Fisioterapi", "Terapi Okupasi", "Terapi Wicara", "PLB (Paedagog)"];

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memuat riwayat jawaban...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />
      <div className="flex-1 flex flex-col">
        <HeaderOrangtua />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Riwayat Jawaban Assessment
            </h1>
            <button
              onClick={() => router.push("/orangtua/dashboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>

          {/* Filter by Therapy */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Berdasarkan Terapi
            </h2>
            <div className="flex flex-wrap gap-2">
              {therapyOptions.map((therapy) => (
                <button
                  key={therapy}
                  onClick={() => setSelectedTherapy(therapy)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedTherapy === therapy
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {therapy === "semua" ? "Semua Terapi" : therapy}
                </button>
              ))}
            </div>
          </div>

          {/* Assessment History List */}
          <div className="space-y-4">
            {filteredHistories.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200 text-center">
                <p className="text-gray-500">Tidak ada riwayat assessment untuk filter yang dipilih.</p>
              </div>
            ) : (
              filteredHistories.map((history) => (
                <div key={history.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {history.nama} - {history.terapi}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tanggal Assessment: {new Date(history.tanggalAssessment).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      history.terapi === "Fisioterapi" ? "bg-green-100 text-green-800" :
                      history.terapi === "Terapi Okupasi" ? "bg-blue-100 text-blue-800" :
                      history.terapi === "Terapi Wicara" ? "bg-purple-100 text-purple-800" :
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {history.terapi}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Hasil Assessment:</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded">
                        {history.hasilAssessment}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Rekomendasi:</h4>
                      <p className="text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        {history.rekomendasi}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500">Total Assessment</h3>
              <p className="text-2xl font-bold text-gray-900">{assessmentHistories.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500">Fisioterapi</h3>
              <p className="text-2xl font-bold text-green-600">
                {assessmentHistories.filter(h => h.terapi === "Fisioterapi").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500">Terapi Okupasi</h3>
              <p className="text-2xl font-bold text-blue-600">
                {assessmentHistories.filter(h => h.terapi === "Terapi Okupasi").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500">Terapi Wicara</h3>
              <p className="text-2xl font-bold text-purple-600">
                {assessmentHistories.filter(h => h.terapi === "Terapi Wicara").length}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}