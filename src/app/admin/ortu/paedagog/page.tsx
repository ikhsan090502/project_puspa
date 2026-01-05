// src/app/admin/ortu/paedagog/page.tsx
import { Suspense } from "react";
import PaedagogClient from "./PaedagogClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Memuat...</div>}>
      <PaedagogClient />
    </Suspense>
  );
}
