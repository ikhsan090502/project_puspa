"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { CalendarDays, User } from "lucide-react";

interface Anak {
  id: string;
  nama: string;
  umur: string;
  gender: string;
  tanggal: string;
}

const dataAnak: Anak[] = [
  { id: "1", nama: "Alleya Karina", umur: "5 Tahun 3 Bulan", gender: "Perempuan", tanggal: "27/09/2025" },
  { id: "2", nama: "Eko Nugroho", umur: "13 Tahun 9 Bulan", gender: "Laki-laki", tanggal: "12/10/2025" },
  { id: "3", nama: "Nadia Rahma", umur: "9 Tahun 2 Bulan", gender: "Perempuan", tanggal: "22/11/2025" },
];

export default function DataUmumPage() {

  const router = useRouter();

  const handleSelectAnak = (id: string) => {
    router.push(`/orangtua/assessment/kategori?children=${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
          <SidebarOrangtua />
    
          <div className="flex-1 flex flex-col ml-64">
            <HeaderOrangtua />
    
    
        <main className="flex-1 overflow-y-auto p-8">
          

          <h2 className="text-lg text-center font-medium mb-6 text-gray-700">
            Pilih Anak untuk Assessment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataAnak.map((anak) => (
              <div
                key={anak.id}
                onClick={() => handleSelectAnak(anak.id)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer p-5"
              >
                <h3 className="text-lg font-semibold text-[#277373] mb-3">{anak.nama}</h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4 mr-2 text-[#277373]" />
                  {anak.umur} • {anak.gender}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4 mr-2 text-[#277373]" />
                  Tanggal Assessment:{" "}
                  <span className="ml-1 font-medium">{anak.tanggal}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
