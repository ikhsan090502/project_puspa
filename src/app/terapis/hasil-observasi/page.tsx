"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import {
  getCompletedObservationDetail,
  getCompletedObservations,
  CompletedObservationDetail,
} from "@/lib/api/observasiSubmit";

export default function HasilObservasiFrame() {
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
        const scheduleItem = list.find(item => item.id.toString() === observationId);

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
