import { Suspense } from 'react';
import RiwayatJawabanClient from './AnakClient';

export default function RiwayatJawabanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanClient />
    </Suspense>
  );
}
