"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CardInfo from "@/components/dashboard/card_info";
import JadwalTable from "@/components/dashboard/jadwal_table";
import PasienChartAdmin from "@/components/dashboard/pasien_chart_admin";
import FormTambahAdmin from "@/components/form/FormTambahAdmin";
import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import { Menu, X } from "lucide-react";
import api from "@/lib/axios";
import { addAdmin } from "@/lib/api/data_admin";
import { addTerapis } from "@/lib/api/data_terapis";

/* =======================
   Interfaces
======================= */

interface DashboardStats {
  assessment_today: number;
  observation_today: number;
  active_patients: number;
  date: {
    current: string;
    formatted: string;
  };
  patient_categories: PatientCategory[];
}

interface PatientCategory {
  type: string;
  type_key: string;
  count: string;
  percentage: number;
}

interface TodaySchedule {
  assessment_id: string;
  nama_pasien: string;
  jenis_terapi: string;
  waktu: string;
}

/* =======================
   API Helpers (❌ TIDAK EXPORT)
======================= */

async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await api.get("/admins/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data?.data ?? null;
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    return null;
  }
}

async function getTodaySchedule(): Promise<TodaySchedule[]> {
  try {
    if (typeof window === "undefined") return [];

    const token = localStorage.getItem("token");
    if (!token) return [];

    const res = await api.get("/admins/dashboard/today-schedule", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const list = res.data?.data ?? [];

    return list.map((item: any) => ({
      assessment_id: item.assessment_id,
      nama_pasien: item.child_name,
      jenis_terapi: Array.isArray(item.types) ? item.types.join(", ") : "",
      waktu: item.time,
    }));
  } catch (error) {
    console.error("❌ Today schedule error:", error);
    return [];
  }
}

/* =======================
   PAGE COMPONENT
======================= */

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([]);
  const [patientCategories, setPatientCategories] = useState<PatientCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [openTambahAdmin, setOpenTambahAdmin] = useState(false);
  const [openTambahTerapis, setOpenTambahTerapis] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, scheduleData] = await Promise.all([
        getDashboardStats(),
        getTodaySchedule(),
      ]);

      setTodaySchedule(scheduleData);

      if (statsData) {
        setStats(statsData);
        setPatientCategories(statsData.patient_categories ?? []);
      } else {
        setStats(null);
        setPatientCategories([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTambahAdmin = async (data: {
    admin_name: string;
    username: string;
    email: string;
    admin_phone: string;
    password?: string;
  }) => {
    try {
      await addAdmin(data);
      setOpenTambahAdmin(false);
      fetchDashboardData();
    } catch (error) {
      console.error("❌ Gagal menambah admin:", error);
    }
  };

  const handleTambahTerapis = async (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
    password: string;
  }) => {
    try {
      await addTerapis(data);
      setOpenTambahTerapis(false);
      fetchDashboardData();
      alert("Terapis berhasil ditambahkan!");
    } catch (error) {
      console.error("❌ Gagal menambah terapis:", error);
      alert("Gagal menambah terapis");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 inset-y-0 left-0 w-64 bg-white shadow-md
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-200 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 space-y-6">
          <CardInfo
            stats={stats}
            loading={loading}
            date={stats?.date?.formatted ?? ""}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <JadwalTable
              jadwal={todaySchedule}
              loading={loading}
              emptyMessage="Tidak ada jadwal hari ini"
            />
            <PasienChartAdmin
              data={patientCategories}
              loading={loading}
            />
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
