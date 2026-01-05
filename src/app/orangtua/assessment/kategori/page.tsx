"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, X, ChevronDown, FileDown } from "lucide-react";

import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

import { downloadAssessmentReport } from "@/lib/api/childrenAsesment";
import { getMyAssessmentDetail } from "@/lib/api/checkStatusAsesment";

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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<string[]>([]);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [completionStatus, setCompletionStatus] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    async function fetchDetail() {
      if (!assessmentId) return;

      try {
        const res = await getMyAssessmentDetail(assessmentId);

        setTypes(res.details.map((d: AssessmentDetail) => d.type));

        const map: Record<string, string> = {};
        res.details.forEach((d: AssessmentDetail) => {
          map[d.type] = d.parent_completed_status;
        });
        setCompletionStatus(map);

        setHasNewFile(Boolean(res.report?.available));
      } catch (err) {
        console.error(err);
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

  const handleDownload = async () => {
    if (!hasNewFile) return;
    try {
      setDownloading(true);
      await downloadAssessmentReport(assessmentId);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-20
          w-64 bg-white shadow-md
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarOrangtua />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-md shadow"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

<div className="flex-1 flex flex-col">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/orangtua/assessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="bg-white shadow rounded-xl border p-6">
            <div className="flex justify-between border-b pb-3 mb-4">
              <h2 className="font-semibold">Kategori</h2>
              <h2 className="font-semibold">Status</h2>
            </div>

            <div className="space-y-6">
              {filteredKategori.map((item, index) => {
                const isCompleted =
                  completionStatus[item.code] === "completed";

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b pb-4 last:border-none"
                  >
                    <div>
                      <h3 className="font-semibold mb-1">
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
                        className="appearance-none border border-gray-300 rounded-lg bg-[#C0DCD6] text-sm px-4 py-2 pr-8 cursor-pointer min-h-[44px]"
                        onChange={(e) =>
                          handleAction(e.target.value, item)
                        }
                        defaultValue=""
                      >
                        <option value="" disabled hidden>
                          Aksi
                        </option>
                        <option value="mulai" disabled={isCompleted}>
                          Mulai
                        </option>
                        <option value="riwayat">Riwayat Jawaban</option>
                      </select>

                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#EEF7F4] border p-5 rounded-xl flex items-center justify-between shadow">
            <div>
              <p className="font-semibold text-lg">File laporan asesmen</p>
              <p className="text-sm mt-1">
                {hasNewFile
                  ? "Asesor telah mengunggah laporan perkembangan terbaru anak Anda."
                  : "Laporan belum tersedia, silakan menunggu unggahan dari asesor."}
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={!hasNewFile || downloading}
              className="flex items-center gap-2 bg-[#36315B] text-white px-5 py-2 rounded-lg disabled:opacity-60"
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
