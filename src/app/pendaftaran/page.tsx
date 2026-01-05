import { Suspense } from 'react';
import TerimakasihClient from './TerimakasihClient';

export default function TerimakasihPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TerimakasihClient />
    </Suspense>
  );
}
