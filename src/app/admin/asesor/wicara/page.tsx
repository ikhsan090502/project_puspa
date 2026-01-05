import { Suspense } from 'react';
import RiwayatWicaraClient from './RiwayatWicaraClient';

export default function RiwayatWicaraPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatWicaraClient />
    </Suspense>
  );
}
