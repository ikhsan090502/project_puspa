import { Suspense } from 'react';
import AssessmentPageClient from './AssessmentPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentPageClient />
    </Suspense>
  );
}
