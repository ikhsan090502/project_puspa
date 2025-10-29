"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

interface EducationHistory {
  id: string;
  nama: string;
  tingkatPendidikan: string;
  namaSekolah: string;
  tahunMasuk: string;
  tahunKeluar: string;
  alasanKeluar: string;
  prestasi: string;
  kesulitanBelajar: string;
}

export default function RiwayatPendidikanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [educationHistories, setEducationHistories] = useState<EducationHistory[]>([]);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  const selectedChildrenIds = searchParams.get("children")?.split(",") || [];

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch("/api/proxy/auth/protected", { credentials: "include" });
        const data = await res.json();

        if (!data?.success || data?.data?.role !== "orangtua") {
          router.replace("/auth/login");
        } else {
          // Mock data for education histories - in real app, fetch from API
          const mockHistories: EducationHistory[] = selectedChildrenIds.map(id => ({
            id,
            nama: id === "1" ? "Ananda" : "Budi",
            tingkatPendidikan: "TK",
            namaSekolah: id === "1" ? "TK ABC" : "TK XYZ",
            tahunMasuk: "2020",
            tahunKeluar: "2022",
            alasanKeluar: "Lulus",
            prestasi: "Juara 1 lomba menggambar",
            kesulitanBelajar: "Kesulitan fokus dalam kelas",
          }));
          setEducationHistories(mockHistories);
          setLoading(false);
        }
      } catch (e) {
        router.replace("/auth/login");
      }
    }

    if (selectedChildrenIds.length === 0) {
      router.replace("/orangtua/assessment");
      return;
    }

    validate();
  }, [router, selectedChildrenIds]);

  const handleNext = () => {
    if (currentChildIndex < educationHistories.length - 1) {
      setCurrentChildIndex(currentChildIndex + 1);
    } else {
      // Navigate to parent assessment form
      router.push(`/orangtua/assessment/form-assessment?children=${selectedChildrenIds.join(",")}`);
    }
  };

  const handlePrev = () => {
    if (currentChildIndex > 0) {
      setCurrentChildIndex(currentChildIndex - 1);
    } else {
      router.push(`/orangtua/assessment/data-umum?children=${selectedChildrenIds.join(",")}`);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memeriksa autentikasi...
    </div>
  );

  const currentHistory = educationHistories[currentChildIndex];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />
      <div className="flex-1 flex flex-col">
        <HeaderOrangtua />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Riwayat Pendidikan Anak
            </h1>
            <span className="text-sm text-gray-600">
              Anak {currentChildIndex + 1} dari {educationHistories.length}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Riwayat Pendidikan {currentHistory?.nama}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tingkat Pendidikan
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentHistory?.tingkatPendidikan}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Sekolah
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentHistory?.namaSekolah}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Masuk
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentHistory?.tahunMasuk}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Keluar
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentHistory?.tahunKeluar}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alasan Keluar
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentHistory?.alasanKeluar}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prestasi
                </label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded min-h-[60px]">{currentHistory?.prestasi}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kesulitan Belajar
                </label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded min-h-[60px]">{currentHistory?.kesulitanBelajar}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {currentChildIndex === 0 ? "Kembali ke Data Umum" : "Anak Sebelumnya"}
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentChildIndex === educationHistories.length - 1 ? "Lanjutkan ke Assessment Orang Tua" : "Anak Selanjutnya"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}