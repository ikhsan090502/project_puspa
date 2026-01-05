import { Suspense } from 'react';
import RiwayatObservasiPageClient from './RiwayatObservasiPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatObservasiPageClient />
    </Suspense>
  );
}
