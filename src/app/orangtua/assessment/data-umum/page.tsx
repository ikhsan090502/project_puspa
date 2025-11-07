"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

interface Child {
  id: string;
  nama: string;
  usia: string;
  jenisKelamin: string;
  tanggalLahir: string;
  tempatLahir: string;
  alamat: string;
  riwayatKesehatan: string;
}

export default function DataUmumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
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
          // Mock data for children - in real app, fetch from API based on selectedChildrenIds
          const mockChildren: Child[] = selectedChildrenIds.map(id => ({
            id,
            nama: id === "1" ? "Ananda" : "Budi",
            usia: id === "1" ? "8 Tahun" : "10 Tahun",
            jenisKelamin: id === "1" ? "Perempuan" : "Laki-laki",
            tanggalLahir: id === "1" ? "2016-05-15" : "2014-03-20",
            tempatLahir: id === "1" ? "Jakarta" : "Bandung",
            alamat: "Jl. Sudirman No. 123, Jakarta",
            riwayatKesehatan: "Tidak ada riwayat penyakit kronis",
          }));
          setChildren(mockChildren);
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
    if (currentChildIndex < children.length - 1) {
      setCurrentChildIndex(currentChildIndex + 1);
    } else {
      // Navigate to education history
      router.push(`/orangtua/assessment/riwayat-pendidikan?children=${selectedChildrenIds.join(",")}`);
    }
  };

  const handlePrev = () => {
    if (currentChildIndex > 0) {
      setCurrentChildIndex(currentChildIndex - 1);
    } else {
      router.push("/orangtua/assessment");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memeriksa autentikasi...
    </div>
  );

  const currentChild = children[currentChildIndex];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />
      <div className="flex-1 flex flex-col">
        <HeaderOrangtua />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Data Umum Anak
            </h1>
            <span className="text-sm text-gray-600">
              Anak {currentChildIndex + 1} dari {children.length}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Identitas {currentChild?.nama}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentChild?.nama}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usia
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentChild?.usia}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentChild?.jenisKelamin}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentChild?.tanggalLahir}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempat Lahir
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentChild?.tempatLahir}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{currentChild?.alamat}</p>
              </div>
            </div>
          </div>

          {/* Data Umum - Riwayat Anak */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Data Umum - Riwayat Anak
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riwayat Kelahiran
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan riwayat kelahiran anak..."
                  defaultValue="Kelahiran normal, berat lahir 3.2 kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perkembangan Motorik Awal
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Perkembangan motorik sejak lahir..."
                  defaultValue="Merangkak pada usia 8 bulan, berjalan pada usia 12 bulan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perkembangan Bahasa Awal
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Perkembangan bahasa sejak lahir..."
                  defaultValue="Berkata kata pertama pada usia 12 bulan"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Riwayat Kesehatan
            </h2>
            <p className="text-gray-900 bg-gray-50 p-4 rounded min-h-[100px]">
              {currentChild?.riwayatKesehatan}
            </p>
          </div>

          {/* Fisioterapi - Keluhan */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Fisioterapi - Keluhan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keluhan Fisik
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan keluhan fisik anak..."
                  defaultValue="Anak mengalami kesulitan berjalan dan koordinasi gerakan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riwayat Cedera
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Jika ada riwayat cedera..."
                  defaultValue="Tidak ada riwayat cedera signifikan"
                />
              </div>
            </div>
          </div>

          {/* Fisioterapi - Riwayat Penyakit */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Fisioterapi - Riwayat Penyakit
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riwayat Penyakit
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Sebutkan riwayat penyakit yang pernah diderita..."
                  defaultValue="Tidak ada riwayat penyakit kronis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengobatan yang Pernah Diterima
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Jika pernah menjalani pengobatan..."
                  defaultValue="Belum pernah menjalani pengobatan khusus"
                />
              </div>
            </div>
          </div>

          {/* Terapi Okupasi - Kondisi Anak */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Okupasi - Kondisi Anak
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kondisi Fisik Saat Ini
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kondisi fisik anak saat ini..."
                  defaultValue="Anak dapat berjalan dan bergerak dengan baik"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemandirian dalam Aktivitas Sehari-hari
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Seberapa mandiri anak dalam aktivitas sehari-hari..."
                  defaultValue="Anak cukup mandiri dalam makan dan berpakaian"
                />
              </div>
            </div>
          </div>

          {/* Terapi Okupasi - Anak Mengalami Kesulitan */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Okupasi - Kesulitan yang Dialami Anak
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kesulitan Motorik
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Jika ada kesulitan motorik..."
                  defaultValue="Sedikit kesulitan dalam koordinasi tangan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kesulitan Sensori
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Jika ada kesulitan sensori..."
                  defaultValue="Tidak ada kesulitan sensori yang signifikan"
                />
              </div>
            </div>
          </div>

          {/* Terapi Okupasi - Aspek Sensori */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Okupasi - Aspek Sensori
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taktil (Penciuman)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Respons terhadap sentuhan..."
                  defaultValue="Respons normal terhadap sentuhan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gustatori (Pengecapan)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Respons terhadap rasa..."
                  defaultValue="Respons normal terhadap rasa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visual (Penglihatan)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Respons terhadap penglihatan..."
                  defaultValue="Penglihatan normal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vestibular (Keseimbangan)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Respons terhadap keseimbangan..."
                  defaultValue="Keseimbangan cukup baik"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proprioseptif (Posisi Tubuh)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Kesadaran posisi tubuh..."
                  defaultValue="Kesadaran posisi tubuh baik"
                />
              </div>
            </div>
          </div>

          {/* Terapi Okupasi - Pernyataan */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Okupasi - Pernyataan Umum
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aktivitas yang Disukai Anak
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Aktivitas yang anak sukai..."
                  defaultValue="Anak suka bermain dengan mainan edukatif"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aktivitas yang Dihindari Anak
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Aktivitas yang anak hindari..."
                  defaultValue="Anak menghindari keramaian yang berisik"
                />
              </div>
            </div>
          </div>

          {/* Terapi Wicara */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Wicara
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Berkomunikasi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Deskripsikan kemampuan komunikasi anak..."
                  defaultValue="Anak dapat berkomunikasi dengan baik menggunakan kata-kata"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kesulitan Berbicara
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Jika ada kesulitan berbicara..."
                  defaultValue="Kadang terbata-bata saat excited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pemahaman Bahasa
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[80px]"
                  placeholder="Tingkat pemahaman bahasa anak..."
                  defaultValue="Anak memahami instruksi sederhana dengan baik"
                />
              </div>
            </div>
          </div>

          {/* Terapi Paedagog - Aspek Akademis */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Paedagog - Aspek Akademis
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Membaca
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Tingkat kemampuan membaca..."
                  defaultValue="Dapat membaca kata-kata sederhana"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Menulis
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Tingkat kemampuan menulis..."
                  defaultValue="Dapat menulis huruf dan angka"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Matematika
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Tingkat kemampuan matematika..."
                  defaultValue="Dapat melakukan operasi hitung sederhana"
                />
              </div>
            </div>
          </div>

          {/* Terapi Paedagog - Aspek Ketunaan */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Paedagog - Aspek Ketunaan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Ketunaan yang Diduga
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Jika ada dugaan ketunaan..."
                  defaultValue="Tidak ada dugaan ketunaan spesifik"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Keparahan
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Tingkat keparahan jika ada..."
                  defaultValue="Ringan hingga sedang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dampak terhadap Pembelajaran
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Dampak terhadap proses belajar..."
                  defaultValue="Sedikit mempengaruhi proses belajar"
                />
              </div>
            </div>
          </div>

          {/* Terapi Paedagog - Aspek Sosialisasi */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Terapi Paedagog - Aspek Sosialisasi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interaksi dengan Teman
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Bagaimana anak berinteraksi dengan teman..."
                  defaultValue="Anak cukup aktif berinteraksi dengan teman"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perilaku Sosial
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Perilaku sosial anak..."
                  defaultValue="Ramah dan mudah bergaul"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kemampuan Berbagi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 min-h-[60px]"
                  placeholder="Kemampuan berbagi dengan orang lain..."
                  defaultValue="Cukup baik dalam berbagi"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {currentChildIndex === 0 ? "Kembali ke Pilih Anak" : "Anak Sebelumnya"}
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentChildIndex === children.length - 1 ? "Lanjutkan ke Riwayat Pendidikan" : "Anak Selanjutnya"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}