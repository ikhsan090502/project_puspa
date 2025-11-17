"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";

const HeaderOrangtua: React.FC = () => {
  const pathname = usePathname();

  // Daftar halaman dan judul yang ditampilkan di header
  const pageTitles: Record<string, string> = {
    "/orangtua/dashboard": "Dashboard",
    "/orangtua/anak": "Data Anak",
    "/orangtua/assessment": "Assessment",
    "/orangtua/assessment/kategori": "Formulir Assessment Orangtua",
    "/orangtua/assessment/kategori/data-umum": "Data Umum",
    "/orangtua/assessment/kategori/fisioterapi": "Data Fisioterapi",
    "/orangtua/assessment/kategori/okupasi": "Data Terapi Okupasi",
    "/orangtua/assessment/kategori/wicara": "Data Terapi Wicara",
    "/orangtua/assessment/kategori/paedagog": "Data Paedagog",
    "/orangtua/assessment/riwayat-jawaban": "Riwayat Jawaban",
    "/orangtua/help": "Bantuan",
    "/orangtua/profil": "Profile",
    "/orangtua/ubahPassword": "Ubah Password",

  };

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow text-[#36315B]">
      {/* Judul Halaman */}
      <h2 className="text-xl font-semibold">{title}</h2>

      {/* Bagian kanan (nama, avatar, notifikasi) */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Halo, Bunda Malaikha</span>

        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          <Image
            src="/profil.png"
            alt="Profil Orang Tua"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>

        <button className="relative flex items-center justify-center w-10 h-10 border border-[#36315B] rounded-lg hover:bg-[#81B7A9] hover:text-white transition">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default HeaderOrangtua;
