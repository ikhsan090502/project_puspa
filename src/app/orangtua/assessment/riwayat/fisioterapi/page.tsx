// src/app/admin/ortu/fisioterapi/page.tsx
import { Suspense } from "react";
import FisioterapiClient from "./FisioterapiClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Memuat...</div>}>
      <FisioterapiClient />
    </Suspense>
  );
}
