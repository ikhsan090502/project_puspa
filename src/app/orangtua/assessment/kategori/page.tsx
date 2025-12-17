"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { ChevronDown, FileDown } from "lucide-react";

import { downloadAssessmentReport } from "@/lib/api/childrenAsesment";
import { getMyAssessmentDetail } from "@/lib/api/checkStatusAsesment";

// =======================
// TYPES
// =======================
interface AssessmentDetail {
  assessment_detail_id: number;
  type: string;
  status: string;
  parent_completed_status: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id") ?? "";

  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<string[]>([]);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /** 🔥 status per type */
  const [completionStatus, setCompletionStatus] = useState<
    Record<string, string>
  >({});

  // =======================
  // FETCH DETAIL
  // =======================
  useEffect(() => {
    async function fetchDetail() {
      if (!assessmentId) return;

      try {
        const res = await getMyAssessmentDetail(assessmentId);

        /** kategori */
        const extractedTypes = res.details.map(
          (item: AssessmentDetail) => item.type
        );
        setTypes(extractedTypes);

        /** 🔥 mapping completed status per type */
        const statusMap: Record<string, string> = {};
        res.details.forEach((item: AssessmentDetail) => {
          statusMap[item.type] = item.parent_completed_status;
        });
        setCompletionStatus(statusMap);

        /** laporan */
        setHasNewFile(Boolean(res.report?.available));
      } catch (err) {
        console.error("Gagal load detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        Assessment ID tidak ditemukan.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // =======================
  // KATEGORI
  // =======================
  const kategoriList = [
    {
      code: "umum",
      kategori: "I. Data Umum",
      subkategori: [
        "A. Identitas",
        "B. Riwayat Anak",
        "C. Riwayat Kesehatan",
        "D. Riwayat Pendidikan",
      ],
      link: `/orangtua/assessment/kategori/data-umum?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/data-umumRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "fisio",
      kategori: "II. Data Fisioterapi",
      subkategori: ["A. Keluhan", "B. Riwayat Penyakit"],
      link: `/orangtua/assessment/kategori/fisioterapi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/fisioterapiRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "okupasi",
      kategori: "III. Terapi Okupasi",
      subkategori: [],
      link: `/orangtua/assessment/kategori/okupasi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/okupasiRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "wicara",
      kategori: "IV. Data Terapi Wicara",
      subkategori: [],
      link: `/orangtua/assessment/kategori/wicara?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/wicaraRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "paedagog",
      kategori: "V. Data Paedagog",
      subkategori: [
        "A. Aspek Akademis",
        "B. Aspek Ketunanan",
        "C. Aspek Sosialisasi - Komunikasi",
      ],
      link: `/orangtua/assessment/kategori/paedagog?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/paedagogRiwayat?assessment_id=${assessmentId}`,
    },
  ];

  const filteredKategori = kategoriList.filter((k) =>
    types.includes(k.code)
  );

  const handleAction = (action: string, item: any) => {
    if (action === "mulai") router.push(item.link);
    if (action === "riwayat") router.push(item.riwayat);
  };

  // =======================
  // DOWNLOAD LAPORAN
  // =======================
  const handleDownload = async () => {
    if (!hasNewFile) return;

    try {
      setDownloading(true);
      await downloadAssessmentReport(assessmentId);
    } catch (err) {
      alert("Gagal mendownload laporan.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/orangtua/assessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {/* KATEGORI CARD */}
          <div className="bg-white shadow rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between border-b pb-3 mb-4">
              <h2 className="font-semibold text-[#36315B]">Kategori</h2>
              <h2 className="font-semibold text-[#36315B]">Status</h2>
            </div>

            <div className="space-y-6">
              {filteredKategori.map((item, index) => {
                const isCompleted =
                  completionStatus[item.code] === "completed";

                return (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b pb-4 last:border-none"
                  >
                    <div>
                      <h3 className="font-semibold text-[#36315B] mb-1">
                        {item.kategori}
                      </h3>

                      <ul className="ml-5 text-sm text-gray-700 space-y-0.5">
                        {item.subkategori.map((sub, idx) => (
                          <li key={idx}>{sub}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative">
                      <select
                        className="appearance-none border border-gray-300 rounded-lg bg-[#C0DCD6] text-[#36315B] text-sm px-4 py-2 pr-8 cursor-pointer"
                        onChange={(e) =>
                          handleAction(e.target.value, item)
                        }
                        defaultValue=""
                      >
                        <option value="" disabled hidden>
                          Aksi
                        </option>

                        {/* 🔥 LOGIC DISABLE MULAI */}
                        <option value="mulai" disabled={isCompleted}>
                          Mulai
                        </option>

                        <option value="riwayat">Riwayat Jawaban</option>
                      </select>

                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-[#36315B]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔥 BANNER LAPORAN */}
          <div className="bg-[#EEF7F4] border border-[#C0DCD6] p-5 rounded-xl flex items-center justify-between shadow">
            <div>
              <p className="font-semibold text-[#36315B] text-lg">
                File laporan asesmen
              </p>
              <p className="text-gray-700 text-sm mt-1">
                {hasNewFile
                  ? "Asesor telah mengunggah laporan perkembangan terbaru anak Anda."
                  : "Laporan belum tersedia, silakan menunggu unggahan dari asesor."}
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={!hasNewFile || downloading}
              className="flex items-center gap-2 bg-[#36315B] text-white px-5 py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileDown className="w-5 h-5" />
              {downloading ? "Mengunduh..." : "Unduh Laporan"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
