"use client";

import { Suspense } from 'react';
import FormAssessmentOrangtuaClient from './FormAssessmentOrangtuaClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormAssessmentOrangtuaClient />
    </Suspense>
  );
}
