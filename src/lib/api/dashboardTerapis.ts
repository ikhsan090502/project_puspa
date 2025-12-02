// src/lib/api/dashboardTerapis.ts

import axiosInstance from "@/lib/axios";

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

// -----------------------------------------------------
// 1. Upcoming Observations
// -----------------------------------------------------
export async function getUpcomingObservations(page: number = 1) {
  try {
    const res = await axiosInstance.get(
      `/asse-thera/upcoming-observations?page=${page}`
    );

    return res.data;
  } catch (error: any) {
    console.error("Error fetching upcoming observations:", error);
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengambil jadwal observasi mendatang"
    );
  }
}

// -----------------------------------------------------
// 2. Dashboard Metrics (month + year filter)
// -----------------------------------------------------
export async function getDashboardMetrics(
  month?: string | number,
  year?: string | number
) {
  try {
    const params = new URLSearchParams();

    if (month) params.append("month", String(month));
    if (year) params.append("year", String(year));

    const res = await axiosInstance.get(
      `/asse-thera/dashboard?${params.toString()}`
    );

    return res.data;
  } catch (error: any) {
    console.error("Error fetching dashboard metrics:", error);
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengambil data dashboard terapis"
    );
  }
}
