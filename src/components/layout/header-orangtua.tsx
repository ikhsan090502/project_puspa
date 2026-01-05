"use client";

import React from "react";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const HeaderOrangtua: React.FC = () => {
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/orangtua/dashboard": "Dashboard",
    "/orangtua/anak": "Data Anak",
    "/orangtua/assessment": "Assessment",
    "/orangtua/assessment/kategori": "Formulir Assessment Orangtua",
    "/orangtua/assessment/kategori/data-umum": "Data Umum",
     "/orangtua/assessment/kategori/data-umumRiwayat": " Riwayat Data Umum",
    "/orangtua/assessment/kategori/fisioterapi": "Data Fisioterapi",
    "/orangtua/assessment/kategori/fisioterapiRiwayat": "Riwayat Data Fisioterapi",
    "/orangtua/assessment/kategori/okupasi": "Data Terapi Okupasi",
    "/orangtua/assessment/kategori/okupasiRiwayat": "Riwayat Data Terapi Okupasi",
    "/orangtua/assessment/kategori/wicara": "Data Terapi Wicara",
    "/orangtua/assessment/kategori/wicaraRiwayat": "Riwayat Data Terapi Wicara",
    "/orangtua/assessment/kategori/paedagog": "Data Paedagog",
    "/orangtua/assessment/kategori/Riwayatpaedagog": "Riwayat Data Paedagog",
    "/orangtua/assessment/riwayat-jawaban": "Riwayat Jawaban",
    "/orangtua/help": "Bantuan",
    "/orangtua/profil": "Profil",
    "/orangtua/ubahPassword": "Ubah Password",
    "/auth/login": "Log Out",
  };

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow text-[#36315B]">
      {/* Judul Halaman */}
      <h2 className="text-xl font-semibold">{title}</h2>

    </header>
  );
};

export default HeaderOrangtua;
