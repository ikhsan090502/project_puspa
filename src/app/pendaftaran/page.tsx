"use client";

import { Suspense, useState } from 'react';
import TerimakasihClient from './TerimakasihClient';
import RegistrationForm from '@/components/RegistrationForm';

function RegistrationPageClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return <TerimakasihClient />;
  }

  return <RegistrationForm onSuccess={() => setIsSubmitted(true)} />;
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationPageClient />
    </Suspense>
  );
}
