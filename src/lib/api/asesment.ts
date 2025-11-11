import axiosInstance from "@/lib/axios";

interface Assessment {
  assessment_id: number;
  child_name: string;
  child_age: string;
  child_gender: string;
  guardian_name: string;
  guardian_phone: string;
  scheduled_date: string;
  status: string;
}

export const getAssessmentsByStatus = async (
  status: "scheduled" | "completed",
  type: "paedagog" | "okupasi" | "wicara" | "fisio"
): Promise<Assessment[]> => {
  try {
    const response = await axiosInstance.get(`/assessments/${status}`, {
      params: { type },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Gagal mengambil data asesmen:", error.response?.data || error.message);
    throw error;
  }
};

export const completeAssessment = async (
  assessmentId: string,
  type: string
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/assessments/${assessmentId}/status`,
      { status: "completed" },
      { params: { type } }
    );
    return data;
  } catch (error: any) {
    console.error("❌ Gagal menyelesaikan assessment:", error.response?.data || error.message);
    throw error;
  }
};


export const submitAssessment = async (
  assessmentId: string,
  type: string,
  payload: Record<string, any>
) => {
  try {
    console.log("📦 DEBUG submit payload:", payload);

    const { data } = await axiosInstance.post(
      `/assessments/${assessmentId}`,
      payload,
      {
        params: { type },
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("✅ Submit assessment sukses:", data);
    return data;
  } catch (error: any) {
    if (error.response) {
      console.error(
        "❌ Gagal submit assessment:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("❌ Gagal submit assessment: Tidak ada respon dari server", error.request);
    } else {
      console.error("❌ Gagal submit assessment:", error.message);
    }
    throw error;
  }
};



export async function getAssessmentAnswers(
  assessmentId: string,
  type: string
): Promise<any> {
  try {
    const { data } = await axiosInstance.get(
      `/assessments/${assessmentId}/answer`, // endpoint untuk ambil jawaban
      { params: { type } }
    );
    console.log("✅ Data jawaban assessment:", data);
    return data.data || {};
  } catch (error: any) {
    console.error("❌ Gagal mengambil jawaban assessment:", {
      url: `/assessments/${assessmentId}/answer?type=${type}`,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    return {};
  }
}
