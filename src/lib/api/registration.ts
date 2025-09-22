import axios, { AxiosError } from "axios";

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
  parent_name: string;
  parent_phone: string;
  parent_type: string;
}

export async function registrationChild(data: RegistrationPayload) {
  try {
    const response = await axios.post(
      "https://50f0aeb59dfd.ngrok-free.app/api/v1/registration",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw {
        message:
          error.response?.data?.message ||
          `Server error: ${error.response?.status || "Unknown"}`,
      };
    } else if (error instanceof Error) {
      throw { message: error.message };
    } else {
      throw { message: "Terjadi kesalahan saat mengirim data." };
    }
  }
}
