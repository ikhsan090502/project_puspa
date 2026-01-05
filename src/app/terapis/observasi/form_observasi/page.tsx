import { Suspense } from 'react';
import FormObservasiPageClient from './FormObservasiPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormObservasiPageClient />
    </Suspense>
  );
}
