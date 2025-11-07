"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validate() {
      const auth = await checkAuth();

      if (!auth.success) {
        router.replace("/auth/login");
        return;
      }

      setAllowed(true);
      setLoading(false);
    }

    validate();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Memeriksa autentikasi...
      </div>
    );
  }

  return <>{allowed && children}</>;
}