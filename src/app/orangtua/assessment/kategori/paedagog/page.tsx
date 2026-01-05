import { Suspense } from 'react';
import PaedagogClient from './PaedagogClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaedagogClient />
    </Suspense>
  );
}
