"use client";

import { AdminProfileProvider } from "@/context/ProfileAdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProfileProvider>
      {children}
    </AdminProfileProvider>
  );
}