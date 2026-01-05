// src/app/admin/ortu/upload_file/page.tsx
import { Suspense } from "react";
import UploadFileClient from "./UploadFileClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Memuat...</div>}>
      <UploadFileClient />
    </Suspense>
  );
}
