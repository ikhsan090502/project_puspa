import { Suspense } from 'react';
import DataFisioterapiClient from './DataFisioterapiClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataFisioterapiClient />
    </Suspense>
  );
}
