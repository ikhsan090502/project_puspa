"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, CalendarDays, User } from "lucide-react";

import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

import {
  getMyAssessments,
  AssessmentItem,
  getMyAssessmentDetail,
} from "@/lib/api/childrenAsesment";

export default function DataUmumClient() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getMyAssessments();
        setAssessments(res.data);
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSelectAssessment = async (assessment_id: string) => {
    if (!assessment_id) return;

    setLoadingDetail(true);
    try {
      await getMyAssessmentDetail(assessment_id);
      router.push(
        `/orangtua/assessment/kategori?assessment_id=${assessment_id}`
      );
    } catch (error) {
      console.error("Failed to load assessment detail:", error);
      alert("Gagal memuat detail assessment. Silakan coba lagi.");
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-20
          w-64 bg-white shadow-md
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarOrangtua />
      </aside>

      {/* overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-md shadow"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* ================= CONTENT ================= */}
<div className="flex-1 flex flex-col">
        <HeaderOrangtua />

        <main className="flex-1 overflow-y-auto p-8 relative">
          <h2 className="text-lg text-center font-semibold mb-6 text-gray-700">
            Pilih Assessment Anak
          </h2>

          {/* loading detail overlay (unchanged) */}
          {loadingDetail && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
              <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.length === 0 && (
              <p className="text-center text-gray-600 col-span-full">
                Tidak ada assessment ditemukan.
              </p>
            )}

            {assessments.map((item) => (
              <div
                key={item.assessment_id}
                onClick={() => handleSelectAssessment(item.assessment_id)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer p-5"
              >
                <h3 className="text-lg font-semibold text-[#277373] mb-3">
                  {item.child_name}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4 mr-2 text-[#277373]" />
                  {item.child_age} • {item.child_gender}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4 mr-2 text-[#277373]" />
                  Jadwal:
                  <span className="ml-1 font-medium">
                    {item.scheduled_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}