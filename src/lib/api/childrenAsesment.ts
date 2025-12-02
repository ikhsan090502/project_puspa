import axiosInstance from "@/lib/axios";

// ==========================================
//  TYPE DEFINITIONS - ASSESSMENTS
// ==========================================
export interface AssessmentItem {
  assessment_id: string;
  child_id: string;
  family_id: string;
  child_name: string;
  child_birth_info: string;
  child_age: string;
  child_gender: string;
  child_school: string;
  scheduled_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponse {
  success: boolean;
  message: string;
  data: AssessmentItem[];
}

// ==========================================
//  FETCH MY ASSESSMENTS
// ==========================================
export async function getMyAssessments(): Promise<AssessmentResponse> {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosInstance.get("/my/assessments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
}



// ==========================================
//  TYPE DEFINITIONS - CHILDREN
// ==========================================
export interface ChildItem {
  child_id: string;
  child_name: string;
  child_birth_date: string;
  child_age: string;
  child_gender: string;
  child_school: string;
}

export interface ChildrenResponse {
  success: boolean;
  message: string;
  data: ChildItem[];
}

// ==========================================
//  FETCH MY CHILDREN (AXIOS)
// ==========================================
export async function getChildren(): Promise<ChildrenResponse> {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosInstance.get("/my/children", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data as ChildrenResponse;
  } catch (error) {
    console.error("Error fetching children:", error);

    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil daftar anak",
      data: [],
    };
  }
}
