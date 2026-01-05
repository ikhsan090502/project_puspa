import { Suspense } from 'react';
import PaedagogFormPageReadOnlyClient from './PaedagogFormPageReadOnlyClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaedagogFormPageReadOnlyClient />
    </Suspense>
  );
}
