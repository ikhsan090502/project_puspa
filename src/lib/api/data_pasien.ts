import api from "@/lib/axios";


export interface Pasien {
  child_id: string;
  child_name: string;
  child_birth_date: string;
  child_age: string;
  child_gender: string;
  child_school: string | null;
}



export async function getAllPasien(): Promise<Pasien[]> {
  try {
    const res = await api.get("/children");
    return res.data?.data || [];
  } catch (error: any) {
    console.error("Gagal mengambil data pasien:", error.response || error);
    throw error;
  }
}


export async function getDetailPasien(childId: string): Promise<Pasien> {
  try {
    const res = await api.get(`/children/${childId}`);
    return res.data?.data;
  } catch (error: any) {
    console.error(`Gagal mengambil detail pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}


export async function updatePasien(childId: string, data: Partial<Pasien>) {
  try {
    const res = await api.put(`/children/${childId}`, data);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal memperbarui pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}


export async function deletePasien(childId: string) {
  try {
    const res = await api.delete(`/children/${childId}`);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal menghapus pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}
