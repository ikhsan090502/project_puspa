import { Suspense } from 'react';
import RiwayatJawabanPaedagogClient from './RiwayatJawabanPaedagogClient';

export default function RiwayatJawabanPaedagogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanPaedagogClient />
    </Suspense>
  );
}
