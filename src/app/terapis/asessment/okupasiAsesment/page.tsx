import { Suspense } from 'react';
import OkupasiAssessmentClient from './OkupasiAssessmentClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OkupasiAssessmentClient />
    </Suspense>
  );
}
