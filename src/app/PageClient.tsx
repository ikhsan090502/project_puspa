"use client";

import React, { useState } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import TerimakasihClient from "./pendaftaran/TerimakasihClient";

export default function PageClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return <TerimakasihClient />;
  }

  return <RegistrationForm onSuccess={() => setIsSubmitted(true)} />;
}