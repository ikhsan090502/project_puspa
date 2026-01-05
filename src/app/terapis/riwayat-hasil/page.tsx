"use client";

import { Suspense } from 'react';
import RiwayatJawabanClient from './RiwayatJawabanClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanClient />
    </Suspense>
  );
}
