import { Suspense } from 'react';
import JadwalClient from './JadwalClient';

export default function JadwalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JadwalClient />
    </Suspense>
  );
}
