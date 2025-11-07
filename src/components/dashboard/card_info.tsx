"use client";

import { CalendarDays, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface DashboardStats {
  todayTherapySessions: number;
  todayObservationSessions: number;
  totalActivePatients: number;
}

export default function CardInfo() {
  // Auto-refresh dashboard stats every 30 seconds
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      console.log("🔄 Fetching dashboard stats...");

      // Fetch data from multiple endpoints
      const [observationsRes, childrenRes] = await Promise.all([
        axiosInstance.get("/observations?status=scheduled"),
        axiosInstance.get("/children")
      ]);

      const scheduledObservations = observationsRes.data.data || [];
      const children = childrenRes.data.data || [];

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Count today's therapy sessions
      const todayTherapySessions = scheduledObservations.filter((obs: any) =>
        obs.scheduled_date?.startsWith(today)
      ).length;

      // Count today's observation sessions
      const todayObservationSessions = scheduledObservations.filter((obs: any) =>
        obs.scheduled_date?.startsWith(today) && obs.type === 'observation'
      ).length;

      // Count active patients (children with active status)
      const totalActivePatients = children.filter((child: any) =>
        child.is_active !== false
      ).length;

      return {
        todayTherapySessions,
        todayObservationSessions,
        totalActivePatients
      };
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: true,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 my-4 text-[#36315B]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-20 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    return (
      <div className="grid grid-cols-3 gap-4 my-4 text-[#36315B]">
        <div className="p-4 bg-red-50 rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
          <div className="text-red-500">⚠️</div>
          <div>
            <p className="text-sm text-red-600">Error loading data</p>
            <p className="text-xs text-red-500">Auto-refresh active</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 my-4 text-[#36315B]">
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <CalendarDays className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Sesi Terapi Hari Ini</p>
          <h3 className="text-lg font-bold">{stats?.todayTherapySessions || 0}</h3>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <CalendarDays className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Sesi Observasi Hari Ini</p>
          <h3 className="text-lg font-bold">{stats?.todayObservationSessions || 0}</h3>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <Users className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Total Pasien Aktif</p>
          <h3 className="text-lg font-bold">{stats?.totalActivePatients || 0}</h3>
        </div>
      </div>
    </div>
  );
}
