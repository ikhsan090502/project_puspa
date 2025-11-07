import axiosInstance from "../axios";
import axios from "axios";

export interface RegistrationPayload {
  child_name: string;
  child_gender: string;
  child_birth_place: string;
  child_birth_date: string;
  child_school: string;
  child_address: string;
  child_complaint: string;
  child_service_choice: string;
  email: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_type: string;
}

export async function registrationChild(payload: RegistrationPayload) {
  try {
    const endpoint = "/registration";
    console.log("🔄 Registration API Call:", {
      endpoint,
      method: "POST",
      baseURL: axiosInstance.defaults.baseURL,
      fullURL: `${axiosInstance.defaults.baseURL}${endpoint}`,
      payload: payload
    });

    const response = await axiosInstance.post(endpoint, payload);
    console.log("✅ Registration API Success:", {
      endpoint,
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Registration API Error:", {
      endpoint: "/registration",
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (axios.isAxiosError(error)) {
      // If backend returns 422, throw the backend error message
      if (error.response?.status === 422) {
        const backendErrors = error.response.data;
        throw new Error(backendErrors.message || backendErrors.error || "Validation error from server");
      }
    }
    throw error;
  }
}
