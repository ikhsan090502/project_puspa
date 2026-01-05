import { Suspense } from 'react';
import TerapiWicaraPageReadOnlyClient from './TerapiWicaraPageReadOnlyClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TerapiWicaraPageReadOnlyClient />
    </Suspense>
  );
}
