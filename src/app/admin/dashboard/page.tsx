"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CardInfo from "@/components/dashboard/card_info";
import JadwalTable from "@/components/dashboard/jadwal_table";
import PasienChart from "@/components/dashboard/pasien_chart";
import FormTambahAdmin from "@/components/form/FormTambahAdmin";
import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import { Users, UserCheck, Calendar, FileText, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openTambahAdmin, setOpenTambahAdmin] = useState(false);
  const [openTambahTerapis, setOpenTambahTerapis] = useState(false);
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalTherapists: 0,
    totalPatients: 0,
    pendingObservations: 0,
    completedAssessments: 0
  });

  useEffect(() => {
    async function validate() {
      console.log("🔍 Validating token on dashboard...");

      try {
        const auth = await checkAuth();
        console.log("✅ Auth check result:", auth);

        // Ambil role dari beberapa kemungkinan struktur respons
        const role =
          auth?.role ||
          auth?.data?.role ||
          auth?.data?.user?.role ||
          "";

        if (auth?.success && role === "admin") {
          console.log("✅ Authorized as admin");
          setLoading(false);
          fetchDashboardStats();
        } else {
          console.log("🚫 Unauthorized, redirecting...");
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("❌ Auth validation failed:", error);
        router.push("/auth/login");
      }
    }

    validate();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch stats from various endpoints
      const [adminsRes, therapistsRes, childrenRes, observationsRes] = await Promise.all([
        fetch("/api/proxy/admins", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token_admin")}`
          },
          credentials: "include"
        }),
        fetch("/api/proxy/therapists", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token_admin")}`
          },
          credentials: "include"
        }),
        fetch("/api/proxy/children", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token_admin")}`
          },
          credentials: "include"
        }),
        fetch("/api/proxy/observations/pending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token_admin")}`
          },
          credentials: "include"
        })
      ]);

      const adminsData = adminsRes.ok ? await adminsRes.json() : { data: [] };
      const therapistsData = therapistsRes.ok ? await therapistsRes.json() : { data: [] };
      const childrenData = childrenRes.ok ? await childrenRes.json() : { data: [] };
      const observationsData = observationsRes.ok ? await observationsRes.json() : { data: [] };

      setStats({
        totalAdmins: adminsData.data?.length || 0,
        totalTherapists: therapistsData.data?.length || 0,
        totalPatients: childrenData.data?.length || 0,
        pendingObservations: observationsData.data?.length || 0,
        completedAssessments: Math.floor(Math.random() * 50) + 10 // Mock data for now
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleTambahAdmin = async (data: any) => {
    try {
      const response = await fetch("/api/proxy/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token_admin")}`
        },
        credentials: "include",
        body: JSON.stringify({
          admin_name: data.nama,
          username: data.username,
          email: data.email,
          admin_phone: data.telepon,
          password: data.password
        })
      });

      if (response.ok) {
        alert("✅ Admin berhasil ditambahkan!");
        setOpenTambahAdmin(false);
        fetchDashboardStats();
      } else {
        const errorData = await response.json();
        alert(`❌ Gagal menambah admin: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("❌ Terjadi kesalahan saat menambah admin");
    }
  };

  const handleTambahTerapis = async (data: any) => {
    try {
      const response = await fetch("/api/proxy/therapists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token_admin")}`
        },
        credentials: "include",
        body: JSON.stringify({
          therapist_name: data.nama,
          therapist_section: data.bidang.toLowerCase().replace(" ", ""),
          username: data.username,
          email: data.email,
          therapist_phone: data.telepon,
          password: data.password
        })
      });

      if (response.ok) {
        alert("✅ Terapis berhasil ditambahkan!");
        setOpenTambahTerapis(false);
        fetchDashboardStats();
      } else {
        const errorData = await response.json();
        alert(`❌ Gagal menambah terapis: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding therapist:", error);
      alert("❌ Terjadi kesalahan saat menambah terapis");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        Memeriksa autentikasi...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#36315B] mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Selamat datang di panel administrasi PuspaCare</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Admin</p>
                  <p className="text-2xl font-bold text-[#36315B]">{stats.totalAdmins}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Terapis</p>
                  <p className="text-2xl font-bold text-[#36315B]">{stats.totalTherapists}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pasien</p>
                  <p className="text-2xl font-bold text-[#36315B]">{stats.totalPatients}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Observasi Pending</p>
                  <p className="text-2xl font-bold text-[#36315B]">{stats.pendingObservations}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assessment Selesai</p>
                  <p className="text-2xl font-bold text-[#36315B]">{stats.completedAssessments}</p>
                </div>
                <FileText className="h-8 w-8 text-teal-500" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-1">
              <CardInfo />
            </div>

            <div className="flex flex-col gap-4 text-[#36315B] min-w-[200px]">
              <button
                onClick={() => setOpenTambahAdmin(true)}
                className="px-4 py-3 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                + Tambah Admin
              </button>

              <button
                onClick={() => setOpenTambahTerapis(true)}
                className="px-4 py-3 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                + Tambah Terapis
              </button>

              <button
                onClick={() => router.push("/admin/laporan")}
                className="px-4 py-3 rounded-lg bg-[#36315B] text-white shadow hover:bg-[#4a3b7a] transition-colors w-full flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Lihat Laporan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <JadwalTable />
            <PasienChart />
          </div>
        </div>
      </main>

      <FormTambahAdmin
        open={openTambahAdmin}
        onClose={() => setOpenTambahAdmin(false)}
        onSave={handleTambahAdmin}
      />

      <FormTambahTerapis
        open={openTambahTerapis}
        onClose={() => setOpenTambahTerapis(false)}
        onSave={handleTambahTerapis}
      />
    </div>
  );
}
