import axiosInstance from "@/lib/axios";

// ==================== Interface ====================
export interface CompletedObservationDetail {
  observation_id: number;
  child_name: string;
  child_birth_place_date: string;
  child_age: string;
  child_gender: string;
  child_school: string;
  child_address: string;
  parent_name: string;
  parent_type: string;
  total_score: number;
  recommendation: string;
  conclusion: string;
  scheduled_date?: string;
}

// ==================== Header Token ====================
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  return {
    Authorization: `${tokenType} ${token}`,
    "Content-Type": "application/json",
  };
};

// ==================== Observations API ====================

// Cache untuk completed observations
// Cache untuk completed observations
let cachedCompleted: any[] = [];

// 🟢 Ambil daftar observasi dengan status 'completed' (pakai cache)
export const getCompletedObservations = async (): Promise<any[]> => {
  if (cachedCompleted.length > 0) return cachedCompleted; // gunakan cache bila tersedia

  try {
    const res = await axiosInstance.get(`/observations?status=completed`, {
      headers: getAuthHeaders(),
    });
    cachedCompleted = res.data?.data ?? [];
    return cachedCompleted;
  } catch (err: any) {
    console.error("❌ Gagal mengambil data completed:", err);
    throw err;
  }
};

// 🟢 Ambil detail observasi completed (dengan retry otomatis jika 429)
export const getCompletedObservationDetail = async (
  observation_id: string,
  retryCount = 0
): Promise<CompletedObservationDetail | null> => {
  if (!observation_id) return null;

  try {
    const res = await axiosInstance.get(`/observations/${observation_id}?type=completed`, {
      headers: getAuthHeaders(),
    });

    const d = res.data.data;
    if (!d) return null;

    return {
      observation_id: d.observation_id,
      child_name: d.child_name || "-",
      child_birth_place_date: d.child_birth_place_date || "-",
      child_age: d.child_age || "-",
      child_gender: d.child_gender || "-",
      child_school: d.child_school || "-",
      child_address: d.child_address || "-",
      parent_name: d.parent_name || "-",
      parent_type: d.parent_type || "-",
      total_score: Number(d.total_score) ?? 0,
      recommendation: d.recommendation || "-",
      conclusion: d.conclusion || "-",
      scheduled_date: d.scheduled_date || "-",
    };
  } catch (err: any) {
    if (err.response?.status === 429 && retryCount < 3) {
      const delay = 2000 * (retryCount + 1);
      console.warn(`⚠️ Rate limit (429). Coba ulang dalam ${delay / 1000} detik...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getCompletedObservationDetail(observation_id, retryCount + 1);
    }

    console.error("❌ Gagal ambil detail observasi:", err);
    return null;
  }
};

// 🟢 Ambil pertanyaan observasi
export const getObservationQuestions = async (observation_id: string): Promise<any[]> => {
  if (!observation_id) return [];
  try {
    const res = await axiosInstance.get(`/observations/${observation_id}?type=question`, {
      headers: getAuthHeaders(),
    });
    return res.data.data;
  } catch (err: any) {
    console.error("❌ Gagal ambil pertanyaan:", err);
    throw err;
  }
};

// 🟢 Submit hasil observasi
export const submitObservation = async (observation_id: string, payload: any): Promise<any> => {
  try {
    const res = await axiosInstance.post(`/observations/${observation_id}/submit`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Gagal submit observasi:", err);
    throw err;
  }
};

// 🟢 Ambil riwayat jawaban observasi
export const getObservationAnswer = async (observation_id: string): Promise<any | null> => {
  if (!observation_id) return null;
  try {
    const res = await axiosInstance.get(`/observations/${observation_id}?type=answer`, {
      headers: getAuthHeaders(),
    });
    return res.data.data;
  } catch (err: any) {
    console.error("❌ Gagal ambil riwayat jawaban:", err);
    throw err;
  }
};

// 🟢 Update tanggal asesmen
export const updateAssessmentDate = async (observation_id: string, date: string): Promise<any> => {
  if (!observation_id) return;
  try {
    const payload = { scheduled_date: date, _method: "PUT" };
    const res = await axiosInstance.post(`/observations/${observation_id}/agreement`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Gagal update tanggal asesmen:", err);
    throw err;
  }
};

// 🟢 Ambil nama observer berdasarkan ID terapis
export const getObserverNameByTherapistId = async (therapistId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const res = await axiosInstance.get("/therapists", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data?.data;
    const therapist = data.find((t: any) => t.id === therapistId);
    return therapist?.therapist_name || "";
  } catch (error: any) {
    console.error("Error ambil nama observer:", error.response || error);
    return "";
  }
};

