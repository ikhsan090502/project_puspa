"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { CheckCircle2, ChevronDown } from "lucide-react";

export default function AssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil assessment_id dari URL
  const assessmentId = searchParams.get("assessment_id");

  // Jika assessment_id tidak ada, tampilkan error
  if (!assessmentId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        Assessment ID tidak ditemukan.
      </div>
    );
  }

  // Semua link kategori akan diberi ?assessment_id=xxxx
  const data = [
    {
      kategori: "I. Data Umum",
      subkategori: [
        "A. Identitas",
        "B. Riwayat Anak",
        "C. Riwayat Kesehatan",
        "D. Riwayat Pendidikan",
      ],
      status: "aksi",
      link: `/orangtua/assessment/kategori/data-umum?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/data-umum/riwayat-identitas?assessment_id=${assessmentId}`,
    },
    {
      kategori: "II. Data Fisioterapi",
      subkategori: ["A. Keluhan", "B. Riwayat Penyakit"],
      status: "aksi",
      link: `/orangtua/assessment/kategori/fisioterapi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/fisioterapiRiwayat?assessment_id=${assessmentId}`,
    },
    {
      kategori: "III. Terapi Okupasi",
      subkategori: [],
      status: "aksi",
      link: `/orangtua/assessment/kategori/okupasi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/okupasiRiwayat?assessment_id=${assessmentId}`,
    },
    {
      kategori: "IV. Data Terapi Wicara",
      subkategori: [],
      status: "aksi",
      link: `/orangtua/assessment/kategori/wicara?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/wicaraRiwayat?assessment_id=${assessmentId}`,
    },
    {
      kategori: "V. Data Paedagog",
      subkategori: [
        "A. Aspek Akademis",
        "B. Aspek Ketunanan",
        "C. Aspek Sosialisasi - Komunikasi",
      ],
      status: "aksi",
      link: `/orangtua/assessment/kategori/paedagog?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/paedagogRiwayat?assessment_id=${assessmentId}`,
    },
  ];

  const handleAction = (value: string, item: any) => {
    if (value === "mulai") {
      router.push(item.link);
    } else if (value === "riwayat") {
      router.push(item.riwayat);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="bg-white shadow rounded-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex justify-between border-b pb-3 mb-4">
              <h2 className="font-semibold text-[#36315B]">Kategori</h2>
              <h2 className="font-semibold text-[#36315B]">Status</h2>
            </div>

            {/* List kategori */}
            <div className="space-y-6">
              {data.map((item, index) => (
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

                  <div>
                    {item.status === "selesai" ? (
                      <CheckCircle2 className="text-green-500 w-6 h-6 mt-2" />
                    ) : (
                      <div className="relative">
                        <select
                          className="appearance-none border border-gray-300 rounded-lg bg-[#C0DCD6] text-[#36315B] text-sm px-4 py-2 pr-8 cursor-pointer"
                          onChange={(e) => handleAction(e.target.value, item)}
                          defaultValue=""
                        >
                          <option value="" disabled hidden>
                            Aksi
                          </option>
                          <option value="mulai">Mulai</option>
                          <option value="riwayat">Riwayat Jawaban</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-[#36315B]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
