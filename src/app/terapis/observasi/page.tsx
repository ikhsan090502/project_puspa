import { Suspense } from 'react';
import ObservasiPageClient from './ObservasiPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ObservasiPageClient />
    </Suspense>
  );
}
