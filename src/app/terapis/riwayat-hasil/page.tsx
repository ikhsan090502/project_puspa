"use client";

import { Suspense } from "react";
import RiwayatJawabanComponent from "./RiwayatJawabanComponent";

export default function RiwayatJawabanPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-[#36315B] font-playpen">
      <div className="text-lg">Memuat halaman...</div>
    </div>}>
      <RiwayatJawabanComponent />
    </Suspense>
  );
}
