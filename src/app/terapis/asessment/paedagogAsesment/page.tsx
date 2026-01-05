import { Suspense } from 'react';
import PLBAssessmentClient from './PLBAssessmentClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PLBAssessmentClient />
    </Suspense>
  );
}
