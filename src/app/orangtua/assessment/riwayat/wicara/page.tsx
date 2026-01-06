import { Suspense } from "react";
import WicaraClient from "./WicaraClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Memuat...</div>}>
      <WicaraClient />
    </Suspense>
  );
}
