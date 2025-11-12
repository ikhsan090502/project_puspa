"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { CheckCircle2, ChevronDown } from "lucide-react";

export default function AssessmentPage() {
  const router = useRouter();

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
      link: "/orangtua/assessment/kategori/data-umum",
    },
    {
      kategori: "II. Data Fisioterapi",
      subkategori: ["A. Keluhan", "B. Riwayat Penyakit"],
      status: "selesai",
      link: "/orangtua/assessment/kategori/fisioterapi",
    },
    {
      kategori: "III. Terapi Okupasi",
      subkategori: [],
      status: "selesai",
      link: "/orangtua/assessment/form/okupasi",
    },
    {
      kategori: "IV. Data Terapi Wicara",
      subkategori: [],
      status: "selesai",
      link: "/orangtua/assessment/form/wicara",
    },
    {
      kategori: "V. Data Paedagog",
      subkategori: [
        "A. Aspek Akademis",
        "B. Aspek Ketunanan",
        "C. Aspek Sosialisasi - Komunikasi",
      ],
      status: "aksi",
      link: "/orangtua/assessment/form/paedagog",
    },
  ];

  const handleAction = (value: string, link: string) => {
    if (value === "mulai") {
      router.push(link); // langsung ke halaman sesuai link, misal /orangtua/assessment/kategori/data-umum
    } else if (value === "riwayat") {
      router.push("/orangtua/assessment/riwayat");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
          <SidebarOrangtua />
    
          <div className="flex-1 flex flex-col ml-64">
            <HeaderOrangtua />
    
    
        <main className="flex-1 overflow-y-auto p-8">
          

          <div className="bg-white shadow rounded-xl border border-gray-200 p-6">
            {/* Header tabel */}
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

                  {/* Kolom Status */}
                  <div>
                    {item.status === "selesai" ? (
                      <CheckCircle2 className="text-green-500 w-6 h-6 mt-2" />
                    ) : (
                      <div className="relative">
                        <select
                          className="appearance-none border border-gray-300 rounded-lg bg-[#C0DCD6] text-[#36315B] text-sm font-medium px-4 py-2 pr-8 focus:outline-none cursor-pointer"
                          onChange={(e) =>
                            handleAction(e.target.value, item.link)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled hidden>
                            Aksi
                          </option>
                          <option value="mulai">Mulai</option>
                          <option value="riwayat">Riwayat Jawaban</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-[#36315B] pointer-events-none" />
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
