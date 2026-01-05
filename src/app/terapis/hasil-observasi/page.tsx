"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import {
  getObservationDetail,
  getObservations,
  CompletedObservationDetail,
} from "@/lib/api/observasiSubmit";

// ================= Helpers =================
function asString(v: unknown, fallback = "-"): string {
  if (typeof v === "string") {
    const s = v.trim();
    return s ? s : fallback;
  }
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

// Tipe aman untuk state (semua field yang dipakai UI dipastikan string/number)
type CompletedObservationDetailSafe = CompletedObservationDetail & {
  scheduled_date: string;
  child_name: string;
  child_birth_place_date: string;
  child_age: string;
  child_gender: string;
  child_school: string;
  child_address: string;
  parent_name: string;
  parent_type: string;
  total_score: number;
  recommendation: string;
  conclusion: string;
};

export default function HasilObservasiFrame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observationId = searchParams.get("id") || searchParams.get("observation_id") || "";

  const [data, setData] = useState<CompletedObservationDetailSafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!observationId) {
      setError("⚠️ Observation ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Ambil daftar observasi completed
        const list = await getObservations("completed");

        // Ambil detail observasi spesifik
        const detail = await getObservationDetail(observationId, "completed");

        // Cari tanggal scheduled terkait
        const scheduleItem = Array.isArray(list)
          ? list.find((item: any) => asString(item?.observation_id, "") === observationId)
          : undefined;

        const scheduledDate = asString((scheduleItem as any)?.scheduled_date, "-");

        if (!detail) {
          if (!cancelled) {
            setError("Data hasil observasi tidak ditemukan.");
            setData(null);
          }
          return;
        }

        const safe: CompletedObservationDetailSafe = {
          ...(detail as any),
          scheduled_date: scheduledDate,

          // pastikan semua yang dipakai UI aman
          child_name: asString((detail as any)?.child_name, "-"),
          child_birth_place_date: asString((detail as any)?.child_birth_place_date, "-"),
          child_age: asString((detail as any)?.child_age, "-"),
          child_gender: asString((detail as any)?.child_gender, "-"),
          child_school: asString((detail as any)?.child_school, "-"),
          child_address: asString((detail as any)?.child_address, "-"),
          parent_name: asString((detail as any)?.parent_name, "-"),
          parent_type: asString((detail as any)?.parent_type, "-"),

          total_score: asNumber((detail as any)?.total_score, 0),
          recommendation: asString((detail as any)?.recommendation, "-"),
          conclusion: asString((detail as any)?.conclusion, "-"),
        };

        if (!cancelled) {
          setData(safe);
          setError(null);
        }
      } catch (err: any) {
        console.error("❌ Error fetch observation detail:", err);
        if (!cancelled) {
          if (err?.response?.status === 429) {
            setError("Terlalu banyak permintaan. Coba lagi beberapa saat.");
          } else {
            setError("Terjadi kesalahan saat mengambil data observasi.");
          }
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [observationId]);

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-10 bg-white m-4 rounded-xl shadow-md overflow-auto">
          {/* Tombol Close */}
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => router.replace("/terapis/observasi/riwayat")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96 text-gray-500 animate-pulse">
              Memuat hasil observasi...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96 text-red-500 font-semibold">
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

              {/* Informasi Anak */}
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Informasi Anak
                </h2>
                <hr className="border-gray-300 mb-6" />

                <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4 text-sm">
                  <InfoItem label="Nama" value={data.child_name} />
                  <InfoItem
                    label="Tempat, Tanggal Lahir"
                    value={data.child_birth_place_date}
                  />
                  <InfoItem label="Usia" value={data.child_age} />
                  <InfoItem label="Jenis Kelamin" value={data.child_gender} />
                  <InfoItem label="Sekolah" value={data.child_school} />
                  <InfoItem label="Alamat" value={data.child_address} />
                  <InfoItem label="Nama Orang Tua" value={data.parent_name} />
                  <InfoItem label="Hubungan (Ayah/Ibu)" value={data.parent_type} />
                  <InfoItem label="Tanggal Observasi" value={data.scheduled_date} />
                </div>
              </section>

              {/* Ringkasan Observasi */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Ringkasan Observasi
                </h2>
                <hr className="border-gray-300 mb-6" />

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-5">
                  <span className="font-semibold text-[#36315B]">Total Skor</span>
                  <span className="text-[#36315B] font-bold text-lg">
                    {data.total_score}
                  </span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                  <p className="text-sm text-[#36315B] mb-1 font-semibold">
                    Rekomendasi
                  </p>
                  <p className="text-[#36315B] font-medium">
                    {data.recommendation}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-[#36315B] mb-1 font-semibold">
                    Kesimpulan Observasi
                  </p>
                  <p className="text-[#36315B] font-medium">{data.conclusion}</p>
                </div>
              </section>

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold rounded-lg transition"
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

/* Komponen InfoItem reusable */
function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-[#36315B] font-semibold">{label}</p>
      <p className="font-medium text-[#36315B]">{value ?? "-"}</p>
    </div>
  );
}
