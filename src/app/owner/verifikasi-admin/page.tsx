"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkAuth } from "@/lib/checkAuth";
import SidebarOwner from "@/components/layout/sidebar_owner";
import HeaderOwner from "@/components/layout/header_owner";
import { UserCheck, X, Check } from "lucide-react";

interface UnverifiedUser {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export default function VerifikasiAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UnverifiedUser[]>([]);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    async function validate() {
      try {
        console.log("🔍 Memeriksa autentikasi Owner...");

        const auth = await checkAuth();
        console.log("✅ Auth result (Owner):", auth);

        if (!auth.success || auth.role !== "owner") {
          console.warn("🚫 Tidak diizinkan, redirect ke login");
          router.replace("/auth/login");
        } else {
          console.log("🎉 Owner terverifikasi, tampilkan verifikasi admin");
          setLoading(false);
          fetchUnverifiedAdmins();
        }
      } catch (e) {
        console.error("🔥 Error saat validasi:", e);
        router.replace("/auth/login");
      }
    }

    validate();
  }, [router]);

  const fetchUnverifiedAdmins = async () => {
    try {
      // This would call the Laravel API endpoint
      // For now, using mock data
      const mockData: UnverifiedUser[] = [
        {
          id: 1,
          name: "Admin Baru",
          email: "adminbaru@example.com",
          username: "adminbaru",
          role: "admin",
          created_at: "2025-11-08T10:00:00Z"
        }
      ];
      setUsers(mockData);
    } catch (error) {
      console.error("Error fetching unverified admins:", error);
    }
  };

  const handleVerify = async (userId: number) => {
    setProcessing(userId);
    try {
      // This would call the Laravel API to verify the user
      console.log("Verifying user:", userId);
      // Remove from list after successful verification
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error verifying user:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: number) => {
    setProcessing(userId);
    try {
      // This would call the Laravel API to reject the user
      console.log("Rejecting user:", userId);
      // Remove from list after rejection
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error rejecting user:", error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memeriksa autentikasi...
    </div>
  );

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarOwner />

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderOwner />

        <main className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Verifikasi Admin</h2>
            <p className="text-gray-600">Kelola permintaan verifikasi admin</p>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Admin Menunggu Verifikasi</h3>
            </div>

            <div className="p-6">
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Tidak ada admin yang menunggu verifikasi
                </p>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{user.name}</h4>
                          <p className="text-gray-600">@{user.username}</p>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Daftar: {new Date(user.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerify(user.id)}
                            disabled={processing === user.id}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {processing === user.id ? "Memproses..." : "Verifikasi"}
                          </button>

                          <button
                            onClick={() => handleReject(user.id)}
                            disabled={processing === user.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            {processing === user.id ? "Memproses..." : "Tolak"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}