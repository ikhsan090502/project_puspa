import { Suspense } from 'react';
import HasilObservasiFrameClient from './HasilObservasiFrameClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HasilObservasiFrameClient />
    </Suspense>
  );
}
