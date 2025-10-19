"use client";

import { Suspense } from "react";
import FormObservasiComponent from "./FormObservasiComponent";

export default function FormObservasiPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-[#36315B] font-playpen">
      <div className="text-lg">Memuat halaman...</div>
    </div>}>
      <FormObservasiComponent />
    </Suspense>
  );
}
