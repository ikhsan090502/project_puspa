// src/app/admin/ortu/okupasi/page.tsx
import { Suspense } from "react";
import OkupasiClient from "./OkupasiClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Memuat...</div>}>
      <OkupasiClient />
    </Suspense>
  );
}
