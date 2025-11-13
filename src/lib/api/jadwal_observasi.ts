import api from "@/lib/axios";

/** 🔹 Tipe data jadwal observasi */
export interface Jadwal {
  id: number;
  nama: string;
  usia: string;
  jenisKelamin: string;
  sekolah: string;
  orangtua: string;
  telepon: string;
  tanggalObservasi?: string | null;
}

/** 🔹 Ambil daftar observasi (status: pending / scheduled) */
export async function getObservations(status: "pending" | "scheduled"): Promise<Jadwal[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/observations?status=${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Pastikan data ada
    const list = response.data?.data || [];

    // Map ke format yang dipakai di page.tsx
    return list.map((item: any) => ({
      id: item.id,
      nama: item.child_name,
      usia: item.child_age,
      jenisKelamin: item.child_gender,
      sekolah: item.child_school,
      orangtua: item.guardian_name,
      telepon: item.guardian_phone,
      tanggalObservasi: item.scheduled_date,
    }));
  } catch (error) {
    console.error("Gagal mengambil data observasi:", error);
    return [];
  }
}

/** 🔹 Simpan / ubah tanggal observasi */
export async function saveObservationDate(id: number, tanggal: string): Promise<boolean> {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/observations/${id}`,
      { scheduled_date: tanggal },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Gagal menyimpan tanggal observasi:", error);
    throw error;
  }
}