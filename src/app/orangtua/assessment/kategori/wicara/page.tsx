import { Suspense } from 'react';
import TerapiWicaraClient from './TerapiWicaraClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TerapiWicaraClient />
    </Suspense>
  );
}
