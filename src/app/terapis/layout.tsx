"use client";

import { TherapistProfileProvider } from "@/context/ProfileTerapisContext";

export default function TerapisLayout({ children }: { children: React.ReactNode }) {
  return (
    <TherapistProfileProvider>
      {children}
    </TherapistProfileProvider>
  );
}
