import api from "@/lib/axios";

export interface Admin {
  id: string;
  nama: string;
  username: string;
  email: string;
  telepon: string;
  ditambahkan: string;
  diubah: string;
}


export async function getAdmins(): Promise<Admin[]> {
  const res = await api.get("/admins");
  return res.data.data.map((item: any) => ({
    id: item.id,
    nama: item.admin_name,
    username: item.username,
    email: item.email,
    telepon: item.admin_phone,
    ditambahkan: item.created_at,
    diubah: item.updated_at,
  }));
}

// 🔹 Ambil detail admin
export async function getAdminById(id: string): Promise<Admin> {
  const res = await api.get(`/admins/${id}`);
  const item = res.data.data;
  return {
    id: item.id,
    nama: item.admin_name,
    username: item.username,
    email: item.email,
    telepon: item.admin_phone,
    ditambahkan: item.created_at,
    diubah: item.updated_at,
  };
}

// 🔹 Tambah admin baru
export async function addAdmin(data: {
  nama: string;
  username: string;
  email: string;
  telepon: string;
  password?: string;
}) {
  return await api.post("/admins", {
    admin_name: data.nama,
    username: data.username,
    email: data.email,
    admin_phone: data.telepon,
    password: data.password || "12345678",
    is_active: 1,
  });
}

// 🔹 Ubah admin
export async function updateAdmin(id: string, data: {
  nama: string;
  username: string;
  email: string;
  telepon: string;
}) {
  return await api.put(`/admins/${id}`, {
    admin_name: data.nama,
    username: data.username,
    email: data.email,
    admin_phone: data.telepon,
  });
}

// 🔹 Hapus admin
export async function deleteAdmin(id: string) {
  return await api.delete(`/admins/${id}`);
}
