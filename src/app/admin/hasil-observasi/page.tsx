import { Suspense } from 'react';
import HasilObservasiFrameClient from './HasilObservasiFrameClient';

export default function HasilObservasiFrame() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HasilObservasiFrameClient />
    </Suspense>
  );
}
