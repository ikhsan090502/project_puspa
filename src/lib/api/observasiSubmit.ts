import axiosInstance from "@/lib/axios";

/* ==================== Interface ==================== */

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

export type ObservationStatus = "scheduled" | "completed";

export type ObservationDetailType =
  | "scheduled"
  | "completed"
  | "question"
  | "answer";

/* ==================== Header Token (SAFE) ==================== */

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  return {
    Authorization: `${tokenType} ${token}`,
    "Content-Type": "application/json",
  };
};

/* ==================== Observations API ==================== */

// 🟢 Ambil daftar observasi
export const getObservations = async (
  status: ObservationStatus,
  date?: string,
  nama?: string
): Promise<Record<string, unknown>[]> => {
  const params: Record<string, string> = {};
  if (date) params.scheduled_date = date;
  if (nama) params.child_name = nama;

  const res = await axiosInstance.get(`/observations/${status}`, {
    headers: getAuthHeaders(),
    params,
  });

  return res.data?.data ?? [];
};

// 🟢 Ambil detail observasi
export const getObservationDetail = async (
  observation_id: string,
  type: ObservationDetailType
): Promise<Record<string, unknown> | null> => {
  if (!observation_id) return null;

  const res = await axiosInstance.get(
    `/observations/${observation_id}/detail`,
    {
      headers: getAuthHeaders(),
      params: { type },
    }
  );

  return res.data?.data ?? null;
};

// 🟢 Ambil pertanyaan observasi
export const getObservationQuestions = async (
  observation_id: string
): Promise<Record<string, unknown>[]> => {
  if (!observation_id) return [];

  const res = await axiosInstance.get(
    `/observations/${observation_id}/detail`,
    {
      headers: getAuthHeaders(),
      params: { type: "question" },
    }
  );

  return res.data?.data ?? [];
};

// 🟢 Submit hasil observasi
export const submitObservation = async (
  observation_id: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const res = await axiosInstance.post(
    `/observations/${observation_id}/submit`,
    payload,
    { headers: getAuthHeaders() }
  );

  return res.data;
};

// 🟢 Ambil jawaban observasi
export const getObservationAnswers = async (
  observation_id: string
): Promise<Record<string, unknown>[]> => {
  if (!observation_id) return [];

  const res = await axiosInstance.get(
    `/observations/${observation_id}/detail`,
    {
      headers: getAuthHeaders(),
      params: { type: "completed" },
    }
  );

  return res.data?.data?.answer_details ?? [];
};

/* ==================== ✅ FIX ERROR IMPORT ==================== */

// 🟢 UPDATE tanggal assessment (INI YANG TADI ERROR)
export const updateAssessmentDate = async (
  observation_id: string,
  scheduled_date: string
): Promise<Record<string, unknown>> => {
  const res = await axiosInstance.put(
    `/observations/${observation_id}/schedule`,
    { scheduled_date },
    { headers: getAuthHeaders() }
  );

  return res.data;
};
