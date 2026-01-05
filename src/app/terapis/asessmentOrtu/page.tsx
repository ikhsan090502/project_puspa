import { Suspense } from 'react';
import AssessmentClient from './AssessmentClient';

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentClient />
    </Suspense>
  );
}
