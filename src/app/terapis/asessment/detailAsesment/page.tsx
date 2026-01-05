import { Suspense } from 'react';
import DetailAssessmentClient from './DetailAssessmentClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailAssessmentClient />
    </Suspense>
  );
}
