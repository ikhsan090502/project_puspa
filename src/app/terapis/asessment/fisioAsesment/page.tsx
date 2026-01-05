import { Suspense } from 'react';
import FisioAsesmentClient from './FisioAsesmentClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FisioAsesmentClient />
    </Suspense>
  );
}
