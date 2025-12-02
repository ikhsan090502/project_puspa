import axiosInstance from "@/lib/axios";

// Daftar tipe assessment parent yang valid
export type ParentAssessmentType =
  | "parent_general"
  | "parent_fisio"
  | "parent_wicara"
  | "parent_okupasi"
  | "parent_paedagog";

// Fetch pertanyaan assessment parent
export const getParentAssessmentQuestions = async (
  type: ParentAssessmentType
) => {
  try {
    const endpoint = `/my/assessments/${type}/question`;
    const res = await axiosInstance.get(endpoint);

    return res.data;
  } catch (error: any) {
    console.error(`Error fetching parent assessment questions (${type}):`, error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data pertanyaan"
    );
  }
};

export type ParentSubmitType =
  | "fisio_parent"
  | "umum_parent"
  | "wicara_parent"
  | "paedagog_parent"
  | "okupasi_parent";

// ==============================
// API SUBMIT JAWABAN PARENT
// ==============================
export const submitParentAssessment = async (
  assessmentId: string | number,
  type: ParentSubmitType,
  payload: any
) => {
  try {
    const endpoint = `/my/assessments/${assessmentId}/submit/${type}`;

    const res = await axiosInstance.post(endpoint, payload);

    return res.data;
  } catch (error: any) {
    console.error(`Error submitting parent assessment (${type}):`, error);
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengirim jawaban assessment parent"
    );
  }
};