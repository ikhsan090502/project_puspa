import { Suspense } from 'react';
import JadwalAsesmenClient from './JadwalAsesmenClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JadwalAsesmenClient />
    </Suspense>
  );
}
