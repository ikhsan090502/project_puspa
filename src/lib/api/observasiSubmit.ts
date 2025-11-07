import axiosInstance from "../axios"; // pastikan file axios.ts ada di /lib atau /src

// 🔹 Interface untuk detail observasi
export interface CompletedObservationDetail {
  id: number;
  child_name: string;
  child_birth_place_date: string;
  child_age: string;
  child_gender: string;
  child_school: string;
  child_address: string;
  parent_name: string;
  parent_type: string;
  scheduled_date: string; // ✅ tambahkan scheduled_date
  total_score: number;
  recommendation: string;
  conclusion: string;
}

// Note: Authentication is now handled automatically by axios interceptors
// No need for manual header management since we're using HTTP-only cookies

// 🟡 Get Questions
export const getObservationQuestions = async (observation_id: string): Promise<any[]> => {
  if (!observation_id) {
    console.warn("⚠️ Observation ID kosong — tidak memanggil API pertanyaan.");
    return [];
  }

  try {
    const url = `/observations/${observation_id}?type=question`;
    const res = await axiosInstance.get(url);
    return res.data.data;
  } catch (err: any) {
    console.error("❌ Gagal ambil pertanyaan:", err);
    throw err;
  }
};

// 🟢 Submit Observation
export const submitObservation = async (observation_id: string, payload: any): Promise<any> => {
  if (!observation_id) return;

  try {
    const url = `/observations/${observation_id}/submit`;
    const res = await axiosInstance.post(url, payload);
    return res.data;
  } catch (err: any) {
    console.error("❌ Gagal submit observasi:", err);
    throw err;
  }
};

// 🟢 Get Completed Observations
export const getCompletedObservations = async (): Promise<any[]> => {
  try {
    const url = `/observations?status=completed`;
    const res = await axiosInstance.get(url);
    return res.data.data;
  } catch (err: any) {
    console.error("❌ Gagal mengambil data completed:", err);
    throw err;
  }
};


export const getCompletedObservationDetail = async (
  observation_id: string
): Promise<CompletedObservationDetail | null> => {
  if (!observation_id) return null;

  try {
    const res = await axiosInstance.get(`/observations/${observation_id}?type=completed`);

    const d = res.data.data;
    if (!d) return null;

    return {
      id: d.id,
      child_name: d.child_name || "-",
      child_birth_place_date: d.child_birth_place_date || "-",
      child_age: d.child_age || "-",
      child_gender: d.child_gender || "-",
      child_school: d.child_school || "-",
      child_address: d.child_address || "-",
      parent_name: d.parent_name || "-",
      parent_type: d.parent_type || "-",
      scheduled_date: d.scheduled_date || "-",
      total_score: d.total_score ?? 0,
      recommendation: d.recommendation || "-",
      conclusion: d.conclusion || "-",
    };
  } catch (err: any) {
    console.error("❌ Gagal ambil detail observasi:", err);
    return null;
  }
};


// 🟢 Get Observation Answer (Riwayat Jawaban)
export const getObservationAnswer = async (observation_id: string): Promise<any | null> => {
  if (!observation_id) return null;

  try {
    const url = `/observations/${observation_id}?type=answer`;
    const res = await axiosInstance.get(url);
    return res.data.data;
  } catch (err: any) {
    console.error("❌ Gagal ambil riwayat jawaban:", err);
    throw err;
  }
};

// 🔹 Update Tanggal Asesmen (PATCH / PUT Agreement)
export const updateAssessmentDate = async (observation_id: string, date: string): Promise<any> => {
  if (!observation_id) {
    console.warn("⚠️ Observation ID kosong — tidak bisa update tanggal asesmen.");
    return;
  }

  try {
    const payload = {
      scheduled_date: date,
      _method: "PUT",
    };

    const res = await axiosInstance.post(`/observations/${observation_id}/agreement`, payload);

    return res.data;
  } catch (err: any) {
    console.error("❌ Gagal update tanggal asesmen:", err);
    throw err;
  }
};

export const getObserverNameByTherapistId = async (therapistId: string) => {
  try {
    const res = await axiosInstance.get("/therapists");

    console.log("Respon /therapists:", res.data);

    const data = res.data?.data;
    if (!data || !Array.isArray(data)) {
      console.warn("Data terapis tidak valid:", data);
      return "";
    }

    const therapist = data.find((t: any) => t.id === therapistId);
    if (!therapist) {
      console.warn("Terapis dengan id", therapistId, "tidak ditemukan");
      return "";
    }

    return therapist.therapist_name || "";
  } catch (error: any) {
    console.error("Error ambil nama observer:", error.response || error);
    return "";
  }
};
