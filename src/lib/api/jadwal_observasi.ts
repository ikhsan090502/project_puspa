import api from "@/lib/axios";

export interface Jadwal {
  id: number;
  nama: string;
  usia: string;
  jenisKelamin: string;
  sekolah: string;
  orangtua: string;
  telepon: string;
  tanggalObservasi?: string | null;
  waktu?: string | null;
  observer?: string | null;
  status?: string | null;
}

export async function getObservations(
  status: "pending" | "scheduled" | "completed"
) {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get(`/observations`, {
      params: { status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("RAW RESPONSE:", res.data);

    const list = res.data?.data || [];

    if (status === "pending") {
      return list.map((item: any) => ({
        id: item.observation_id,
        nama: item.child_name,
        usia: item.child_age,
        jenisKelamin: item.child_gender,
        sekolah: item.child_school,
        orangtua: item.guardian_name,
        telepon: item.guardian_phone,
        tanggalObservasi: null,
        waktu: null,
        observer: null,
        status: item.status,
      }));
    }

   
    if (status === "scheduled") {
      return list.map((item: any) => ({
        id: item.observation_id,
        nama: item.child_name,
        usia: item.child_age,
        jenisKelamin: item.child_gender,
        sekolah: item.child_school,
        orangtua: item.guardian_name,
        telepon: "-",
        tanggalObservasi: item.scheduled_date,
        waktu: item.scheduled_time,
        observer: null,
        status: item.status,
      }));
    }

   
    if (status === "completed") {
      return list.map((item: any) => ({
        id: item.observation_id,
        nama: item.child_name,
        usia: item.child_age,
        jenisKelamin: "-",
        sekolah: item.child_school,
        orangtua: "-",
        telepon: "-",
        tanggalObservasi: item.scheduled_date,
        waktu: item.time,
        observer: item.observer,
        status: item.status,
      }));
    }

    return [];
  } catch (error) {
    console.error("ERROR getObservations:", error);
    return [];
  }
}
