import { Suspense } from 'react';
import DataTerapiOkupasiPageReadOnlyClient from './DataTerapiOkupasiPageReadOnlyClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTerapiOkupasiPageReadOnlyClient />
    </Suspense>
  );
}
