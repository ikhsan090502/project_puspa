"use client";

import { Suspense } from "react";
import HasilObservasiComponent from "./HasilObservasiComponent";

export default function HasilObservasiFrame() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-[#36315B] font-playpen">
      <div className="text-lg">Memuat halaman...</div>
    </div>}>
      <HasilObservasiComponent />
    </Suspense>
  );
}
