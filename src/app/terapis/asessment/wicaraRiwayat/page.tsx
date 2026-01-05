import { Suspense } from 'react';
import RiwayatWicaraClient from './RiwayatWicaraClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatWicaraClient />
    </Suspense>
  );
}
