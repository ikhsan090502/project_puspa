import { Suspense } from 'react';
import RiwayatOkupasiParentPageClient from './RiwayatOkupasiParentPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatOkupasiParentPageClient />
    </Suspense>
  );
}
