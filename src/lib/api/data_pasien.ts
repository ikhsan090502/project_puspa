import api from "@/lib/axios";

// ======================
// ✅ INTERFACES
// ======================
export interface Pasien {
  child_id: string;
  child_name: string;
  child_birth_info: string;
  child_age: string;
  child_gender: string | null;
  child_religion: string | null;
  child_school: string | null;
  child_address: string | null;
  child_complaint?: string;
  child_service_choice?: string;

  father_name?: string;
  father_age?: string;
  father_occupation?: string;
  father_phone?: string;
  father_relationship?: string;
  father_identity_number?: string;

  mother_name?: string;
  mother_age?: string;
  mother_occupation?: string;
  mother_phone?: string;
  mother_relationship?: string;
  mother_identity_number?: string;

  guardian_name?: string;
  guardian_age?: string;
  guardian_occupation?: string;
  guardian_phone?: string;
  guardian_relationship?: string;
  guardian_identity_number?: string;
}

// Payload untuk update pasien
export interface UpdatePasienPayload {
  child_name?: string;
  child_birth_info?: string;
  child_gender?: string | null;
  child_religion?: string | null;
  child_school?: string | null;
  child_address?: string | null;
  child_complaint?: string;
  child_service_choice?: string;

  father_name?: string;
  father_age?: string;
  father_occupation?: string;
  father_phone?: string;
  father_relationship?: string;
  father_identity_number?: string;

  mother_name?: string;
  mother_age?: string;
  mother_occupation?: string;
  mother_phone?: string;
  mother_relationship?: string;
  mother_identity_number?: string;

  guardian_name?: string;
  guardian_age?: string;
  guardian_occupation?: string;
  guardian_phone?: string;
  guardian_relationship?: string;
  guardian_identity_number?: string;
}

// ======================
// ✅ GET ALL PASIEN
// ======================
export async function getAllPasien(): Promise<Pasien[]> {
  try {
    const res = await api.get("/children");
    return res.data?.data || [];
  } catch (error: any) {
    console.error("Gagal mengambil data pasien:", error.response || error);
    throw error;
  }
}

// ======================
// ✅ GET DETAIL PASIEN
// ======================
export async function getDetailPasien(childId: string): Promise<Pasien> {
  try {
    const res = await api.get(`/children/${childId}`);
    return { ...res.data?.data, child_id: childId }; // <--- tambahkan child_id
  } catch (error: any) {
    console.error(`Gagal mengambil detail pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}


// ======================
// ✅ UPDATE PASIEN
// ======================
export async function updatePasien(childId: string, data: UpdatePasienPayload) {
  if (!childId) throw new Error("child_id tidak boleh kosong");
  try {
    const res = await api.put(`/children/${childId}`, data);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal memperbarui pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}

// ======================
// ✅ DELETE PASIEN
// ======================
export async function deletePasien(childId: string) {
  if (!childId) throw new Error("child_id tidak boleh kosong");
  try {
    const res = await api.delete(`/children/${childId}`);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal menghapus pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}
