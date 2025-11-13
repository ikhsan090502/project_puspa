import api from "@/lib/axios";

/* =============================
   Tipe data sesuai API backend
============================= */
export interface Pasien {
  id: string;
  child_name: string;
  child_birth_date: string;
  child_age: string;
  child_gender: string;
  child_school: string;
}

/* =============================
   1️⃣ GET semua data pasien
   GET https://puspa.sinus.ac.id/api/v1/children
============================= */
export async function getAllPasien(): Promise<Pasien[]> {
  try {
    const res = await api.get("/children");
    // backend mengembalikan { success, message, data: [...] }
    return res.data?.data || [];
  } catch (error: any) {
    console.error("Gagal mengambil data pasien:", error.response || error);
    throw error;
  }
}

/* =============================
   2️⃣ GET detail pasien
   GET https://puspa.sinus.ac.id/api/v1/children/{child_id}
============================= */
export async function getDetailPasien(childId: string): Promise<Pasien> {
  try {
    const res = await api.get(`/children/${childId}`);
    return res.data?.data;
  } catch (error: any) {
    console.error(`Gagal mengambil detail pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}

/* =============================
   3️⃣ UPDATE data pasien
   POST https://puspa.sinus.ac.id/api/v1/children/{child_id}
============================= */
export async function updatePasien(childId: string, data: Partial<Pasien>) {
  try {
    const res = await api.post(`/children/${childId}`, data);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal memperbarui pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}

/* =============================
   4️⃣ HAPUS data pasien
   DELETE https://puspa.sinus.ac.id/api/v1/children/{child_id}
============================= */
export async function deletePasien(childId: string) {
  try {
    const res = await api.delete(`/children/${childId}`);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal menghapus pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}
