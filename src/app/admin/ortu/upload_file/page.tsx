import { Suspense } from "react";
import UploadFileClient from "./UploadFileClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <UploadFileClient />
    </Suspense>
  );
}
