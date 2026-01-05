import { Suspense } from 'react';
import DataUmumClient from './DataUmumClient';

export default function DataUmumPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataUmumClient />
    </Suspense>
  );
}
