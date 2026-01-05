"use client";

import { ProfileProvider } from "@/context/ProfileContext";

export default function OrangtuaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      {children}
    </ProfileProvider>
  );
}
