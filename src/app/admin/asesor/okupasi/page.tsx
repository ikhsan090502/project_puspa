import { Suspense } from 'react';
import RiwayatJawabanOkupasiClient from './RiwayatJawabanOkupasiClient';

export default function RiwayatJawabanOkupasiPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanOkupasiClient />
    </Suspense>
  );
}
