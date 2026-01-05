import { Suspense } from 'react';
import DataTerapiOkupasiClient from './DataTerapiOkupasiClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTerapiOkupasiClient />
    </Suspense>
  );
}
