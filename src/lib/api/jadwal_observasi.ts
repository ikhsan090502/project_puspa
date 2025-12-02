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

// ========================================================
// GET OBSERVATIONS (Pending / Scheduled / Completed)
// ========================================================
export async function getObservations(
  status: "pending" | "scheduled" | "completed",
  search: string = "",
  date?: string
) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let endpoint = "/observations";

    if (status === "pending") endpoint = "/observations/pending";
    if (status === "scheduled") endpoint = "/observations/scheduled";
    if (status === "completed") endpoint = "/observations/completed";

    const params: any = { search };

    if (date) params.date = date;   // ⬅ hanya kirim kalau ada

    const res = await api.get(endpoint, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });

    const list = res.data?.data || [];

    return list.map((item: any) => ({
      id: item.observation_id,
      nama: item.child_name,
      usia: item.child_age,
      jenisKelamin: item.child_gender,
      sekolah: item.child_school,
      orangtua: item.guardian_name,
      telepon: item.guardian_phone,
      tanggalObservasi:
        status === "pending" ? null :
        status === "scheduled" ? item.scheduled_date :
        item.completed_date,
      waktu:
        status === "pending" ? null :
        status === "scheduled" ? item.scheduled_time :
        item.completed_time,
      observer: item.administrator,
      status: item.status,
    }));
  } catch (error) {
    console.error("ERROR getObservations:", error);
    return [];
  }
}


// ========================================================
// UPDATE OBSERVATION SCHEDULE (PUT)
// ========================================================
export async function updateObservationSchedule(
  id: number,
  scheduled_date: string,
  scheduled_time: string
) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await api.post(
      `/observations/${id}`,
      {
        scheduled_date,
        scheduled_time,
        _method: "PUT",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("UPDATE RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("ERROR updateObservationSchedule:", error);
    throw error;
  }
}

export async function getObservationDetail(id: number, type: "pending" | "scheduled" | "completed") {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.get(`/observations/${id}/detail`, {
      params: { type },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.data || null;
  } catch (err) {
    console.error("ERROR getObservationDetail:", err);
    return null;
  }
}
