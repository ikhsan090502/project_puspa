"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import {
  getCompletedObservationDetail,
  getCompletedObservations,
  CompletedObservationDetail,
} from "@/lib/api/observasiSubmit";

export default function HasilObservasiComponent() {
  const searchParams = useSearchParams();
  const observationId = searchParams.get("id");

  const [data, setData] = useState<CompletedObservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!observationId) {
      setError("⚠️ Observation ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const detail = await getCompletedObservationDetail(observationId);
        const list = await getCompletedObservations();
        const scheduleItem = list.find((item: any) => item.id.toString() === observationId);

        if (!detail) {
          setError("Data hasil observasi tidak ditemukan.");
          setData(null);
        } else {
          setData({
            ...detail,
            scheduled_date: scheduleItem?.scheduled_date || "-"
          });
          setError(null);
        }
      } catch (err) {
        console.error("❌ Error fetch observation detail:", err);
        setError("Terjadi kesalahan saat mengambil data.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [observationId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col overflow-auto">
        <HeaderTerapis />
        <main className="p-10 bg-white m-4 rounded-xl shadow-md overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Memuat hasil observasi...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96 text-gray-500">
              {error}
            </div>
          ) : !data ? (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Data hasil observasi tidak ditemukan.
            </div>
          ) : (
            <>
              <h1 className="text-center text-2xl font-extrabold text-[#2E2E4D] mb-10">
                HASIL OBSERVASI
              </h1>

              <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Informasi Anak
                </h2>
                <hr className="border-gray-300 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-[#36315B] font-semibold">Nama</p>
                    <p className="font-medium text-[#36315B]">{data.child_name}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Tempat, Tanggal Lahir</p>
                    <p className="font-medium text-[#36315B]">{data.child_birth_place_date}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Usia</p>
                    <p className="font-medium text-[#36315B]">{data.child_age}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Jenis Kelamin</p>
                    <p className="font-medium text-[#36315B] capitalize">{data.child_gender}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Sekolah</p>
                    <p className="font-medium text-[#36315B]">{data.child_school}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Alamat</p>
                    <p className="font-medium text-[#36315B]">{data.child_address}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Nama Orang Tua</p>
                    <p className="font-medium text-[#36315B]">{data.parent_name}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Hubungan (Ayah/Ibu)</p>
                    <p className="font-medium text-[#36315B] capitalize">{data.parent_type}</p>
                  </div>
                  <div>
                    <p className="text-[#36315B] font-semibold">Tanggal Observasi</p>
                    <p className="font-medium text-[#36315B]">{data.scheduled_date}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Ringkasan Observasi</h2>
                <hr className="border-gray-300 mb-6" />

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-5">
                  <span className="font-semibold text-[#36315B]">Total Skor</span>
                  <span className="text-[#36315B] font-bold text-lg">{data.total_score ?? 0}</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                  <p className="text-ms text-[#36315B] mb-1 font-semibold">Rekomendasi</p>
                  <p className="text-[#36315B] font-medium">{data.recommendation}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="text-ms text-[#36315B] mb-1 font-semibold">Kesimpulan Observasi</p>
                  <p className="text-[#36315B] font-medium">{data.conclusion}</p>
                </div>
              </section>

              {/* Detail Kategori Observasi */}
              <section className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Detail Kategori Observasi</h2>
                <hr className="border-gray-300 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aspek Perilaku & Emosi */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#36315B] mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Perilaku & Emosi
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Skor:</span> {data.total_score ? Math.round(data.total_score * 0.25) : 0}</p>
                      <p><span className="font-medium">Status:</span> Normal</p>
                      <p className="text-gray-600 mt-2">Anak menunjukkan perilaku yang stabil dan kontrol emosi yang baik.</p>
                    </div>
                  </div>

                  {/* Aspek Fungsi Motorik */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#36315B] mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Fungsi Motorik
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Skor:</span> {data.total_score ? Math.round(data.total_score * 0.20) : 0}</p>
                      <p><span className="font-medium">Status:</span> Perlu Perhatian</p>
                      <p className="text-gray-600 mt-2">Ada beberapa kesulitan dalam koordinasi motorik halus.</p>
                    </div>
                  </div>

                  {/* Aspek Bahasa & Bicara */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#36315B] mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      Bahasa & Bicara
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Skor:</span> {data.total_score ? Math.round(data.total_score * 0.20) : 0}</p>
                      <p><span className="font-medium">Status:</span> Normal</p>
                      <p className="text-gray-600 mt-2">Kemampuan bahasa dan bicara dalam batas normal.</p>
                    </div>
                  </div>

                  {/* Aspek Kognitif & Atensi */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#36315B] mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      Kognitif & Atensi
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Skor:</span> {data.total_score ? Math.round(data.total_score * 0.15) : 0}</p>
                      <p><span className="font-medium">Status:</span> Normal</p>
                      <p className="text-gray-600 mt-2">Kemampuan kognitif dan atensi dalam rentang normal.</p>
                    </div>
                  </div>

                  {/* Aspek Sosial & Emosi */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm md:col-span-2">
                    <h3 className="text-lg font-semibold text-[#36315B] mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      Sosial & Emosi
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Skor:</span> {data.total_score ? Math.round(data.total_score * 0.20) : 0}</p>
                      <p><span className="font-medium">Status:</span> Normal</p>
                      <p className="text-gray-600 mt-2">Interaksi sosial dan regulasi emosi berjalan dengan baik.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rekomendasi Terapi */}
              <section className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Rekomendasi Terapi</h2>
                <hr className="border-gray-300 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">🏥</div>
                    <h4 className="font-semibold text-blue-800">Fisioterapi</h4>
                    <p className="text-sm text-blue-600 mt-1">Untuk meningkatkan koordinasi motorik</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">👐</div>
                    <h4 className="font-semibold text-green-800">Terapi Okupasi</h4>
                    <p className="text-sm text-green-600 mt-1">Untuk kemandirian sehari-hari</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">🗣️</div>
                    <h4 className="font-semibold text-purple-800">Terapi Wicara</h4>
                    <p className="text-sm text-purple-600 mt-1">Untuk pengembangan bahasa</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">📚</div>
                    <h4 className="font-semibold text-orange-800">PLB (Paedagog)</h4>
                    <p className="text-sm text-orange-600 mt-1">Untuk dukungan akademis</p>
                  </div>
                </div>
              </section>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => history.back()}
                  className="px-6 py-2 bg-[#81B7A9] hover:bg-[#36315B] text-[#FFFFFF] font-semibold rounded-lg transition"
                >
                  Kembali
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}