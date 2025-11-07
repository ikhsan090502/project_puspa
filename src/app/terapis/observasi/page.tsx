"use client";

import { Suspense } from "react";
import ObservasiComponent from "./ObservasiComponent";

export default function ObservasiPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-[#36315B] font-playpen">
      <div className="text-lg">Memuat halaman...</div>
    </div>}>
      <ObservasiComponent />
    </Suspense>
  );
}
