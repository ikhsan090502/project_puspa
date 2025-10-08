"use client";
import Image from "next/image";

export default function HeaderOrangtua() {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-3 border-b">
      <h1 className="font-semibold text-gray-700">Dashboard Orang Tua</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Bunda Anisa</span>
        <Image
           src="/profil.png"
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
    </header>
  );
}
