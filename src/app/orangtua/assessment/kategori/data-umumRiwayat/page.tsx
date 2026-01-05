"use client";

import { Suspense } from 'react';
import RiwayatJawabanOrangtuaClient from './RiwayatJawabanOrangtuaClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiwayatJawabanOrangtuaClient />
    </Suspense>
  );
}
