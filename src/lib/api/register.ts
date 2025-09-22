import axios from "axios";

export async function registerUser({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const res = await axios.post(
      "https://50f0aeb59dfd.ngrok-free.app/api/v1/auth/register",
      {
        username,
        email,
        password,
      }
    );

    return res.data; 
  } catch (err: any) {
    if (err.response) {
      if (err.response.status === 409) {
        throw new Error(
          err.response.data.errors?.error ||
            "Email atau username sudah terdaftar."
        );
      }
      throw new Error(err.response.data.message || "Gagal melakukan registrasi.");
    }
    throw new Error("Gagal menghubungi server.");
  }
}
