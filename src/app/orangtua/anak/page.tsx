import { Suspense } from 'react';
import RiwayatJawabanClient from './RiwayatJawabanClient';

export default function RiwayatJawabanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanClient />
    </Suspense>
  );
}
