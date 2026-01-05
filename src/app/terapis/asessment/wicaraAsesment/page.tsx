import { Suspense } from 'react';
import WicaraAsesmentClient from './WicaraAsesmentClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WicaraAsesmentClient />
    </Suspense>
  );
}
