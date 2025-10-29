"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

interface Child {
  id: string;
  nama: string;
  usia: string;
  jenisKelamin: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch("/api/proxy/auth/protected", { credentials: "include" });
        const data = await res.json();

        if (!data?.success || data?.data?.role !== "orangtua") {
          router.replace("/auth/login");
        } else {
          // Mock data for children - in real app, fetch from API
          setChildren([
            { id: "1", nama: "Ananda", usia: "8 Tahun", jenisKelamin: "Perempuan" },
            { id: "2", nama: "Budi", usia: "10 Tahun", jenisKelamin: "Laki-laki" },
          ]);
          setLoading(false);
        }
      } catch (e) {
        router.replace("/auth/login");
      }
    }

    validate();
  }, [router]);

  const handleChildSelect = (childId: string) => {
    setSelectedChildren(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const handleContinue = () => {
    if (selectedChildren.length === 0) {
      alert("Pilih setidaknya satu anak untuk melanjutkan.");
      return;
    }

    // Navigate to next step - general child data
    const selectedChildIds = selectedChildren.join(",");
    router.push(`/orangtua/assessment/data-umum?children=${selectedChildIds}`);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memeriksa autentikasi...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />
      <div className="flex-1 flex flex-col">
        <HeaderOrangtua />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Assessment Anak
          </h1>
          <p className="text-gray-600">
            Pilih anak yang akan dilakukan assessment. Anda dapat memilih satu atau lebih anak.
          </p>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Pilih Anak
            </h2>

            <div className="space-y-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedChildren.includes(child.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleChildSelect(child.id)}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedChildren.includes(child.id)}
                      onChange={() => handleChildSelect(child.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{child.nama}</h3>
                      <p className="text-sm text-gray-600">
                        Usia: {child.usia} | Jenis Kelamin: {child.jenisKelamin}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleContinue}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}