import { Suspense } from 'react';
import DataFisioterapiPageClient from './DataFisioterapiPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataFisioterapiPageClient />
    </Suspense>
  );
}
