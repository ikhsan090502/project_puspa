import { Suspense } from 'react';
import RiwayatJawabanUmumClient from './RiwayatJawabanUmumClient';

export default function RiwayatJawabanUmum() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanUmumClient />
    </Suspense>
  );
}
