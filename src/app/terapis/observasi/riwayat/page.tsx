"use client";

import { Suspense } from "react";
import RiwayatObservasiComponent from "./RiwayatObservasiComponent";

export default function RiwayatObservasiPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-[#36315B] font-playpen">
      <div className="text-lg">Memuat halaman...</div>
    </div>}>
      <RiwayatObservasiComponent />
    </Suspense>
  );
}
