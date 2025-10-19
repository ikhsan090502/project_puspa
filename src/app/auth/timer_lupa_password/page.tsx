"use client";

import { Suspense } from "react";
import TimerLupaPasswordComponent from "./TimerLupaPasswordComponent";

export default function TimerLupaPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#C9EAE0] font-playpen">
      <div className="text-[#36315B] text-lg">Memuat halaman...</div>
    </div>}>
      <TimerLupaPasswordComponent />
    </Suspense>
  );
}
