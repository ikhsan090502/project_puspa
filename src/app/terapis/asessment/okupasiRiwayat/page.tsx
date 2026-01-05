import { Suspense } from 'react';
import RiwayatJawabanOkupasiClient from './RiwayatJawabanOkupasiClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanOkupasiClient />
    </Suspense>
  );
}
