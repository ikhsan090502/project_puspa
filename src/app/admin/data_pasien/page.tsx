"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import FormUbahPatient from "@/components/form/FormUbahPatient";
import api from "@/lib/axios";

type PatientItem = {
  child_id: string;
  child_name: string;
  child_birth_info?: string;
  child_birth_date?: string;
  child_age?: string;
  child_gender?: string | null;
  child_school?: string;
  child_address?: string;
  child_complaint?: string;
  child_service_choice?: string;

  father_identity_number?: string;
  father_name?: string;
  father_phone?: string;
  father_birth_date?: string;
  father_occupation?: string;
  father_relationship?: string;

  mother_identity_number?: string;
  mother_name?: string;
  mother_phone?: string;
  mother_birth_date?: string;
  mother_occupation?: string;
  mother_relationship?: string;

  guardian_identity_number?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_birth_date?: string;
  guardian_occupation?: string;
  guardian_relationship?: string;
};

type ApiListResponse<T> =
  | T[]
  | { success?: boolean; data?: T[]; message?: string; result?: T[] }
  | { data?: T[] }
  | { patients?: T[] }
  | { items?: T[] };

function normalizeList<T>(body: any): T[] {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.result)) return body.result;
  if (Array.isArray(body.patients)) return body.patients;
  if (Array.isArray(body.items)) return body.items;
  if (body.success && Array.isArray(body.data)) return body.data;
  return [];
}

/**
 * ✅ Kandidat endpoint (silakan tambahkan kalau Anda punya pola lain)
 * Karena Anda pakai baseURL: https://puspa.sinus.ac.id/api/v1
 * maka di sini cukup path setelah /api/v1
 */
const PATIENT_LIST_ENDPOINTS = [
  "/admin/patients",
  "/admin/patient",
  "/admin/data-pasien",
  "/admin/pasien",
  "/admin/children",
  "/patients",
  "/patient",
  "/data-pasien",
  "/pasien",
  "/children",
];

const PATIENT_UPDATE_ENDPOINTS = [
  (id: string) => `/admin/patients/${id}`,
  (id: string) => `/admin/patient/${id}`,
  (id: string) => `/admin/data-pasien/${id}`,
  (id: string) => `/admin/pasien/${id}`,
  (id: string) => `/admin/children/${id}`,
  (id: string) => `/patients/${id}`,
  (id: string) => `/patient/${id}`,
  (id: string) => `/data-pasien/${id}`,
  (id: string) => `/pasien/${id}`,
  (id: string) => `/children/${id}`,
];

async function fetchPatientsAuto(): Promise<{
  data: PatientItem[];
  usedEndpoint: string | null;
}> {
  let lastErr: any = null;

  for (const ep of PATIENT_LIST_ENDPOINTS) {
    try {
      const res = await api.get<ApiListResponse<PatientItem>>(ep);
      const list = normalizeList<PatientItem>(res.data);

      // kalau endpoint ketemu tapi list kosong, tetap dianggap valid
      return { data: list, usedEndpoint: ep };
    } catch (e: any) {
      lastErr = e;
      // kalau 404, lanjut coba endpoint lain
      const status = e?.response?.status;
      if (status === 404) continue;

      // selain 404 (401/500/dll) -> stop, karena endpoint mungkin benar tapi error auth/server
      throw e;
    }
  }

  // semua 404
  const err = lastErr || new Error("Semua endpoint 404");
  (err as any).__all404 = true;
  throw err;
}

async function updatePatientAuto(usedListEndpoint: string | null, child_id: string, payload: any) {
  // kalau kita sudah tau endpoint list yang valid, coba turunkan pola update yang mirip dulu
  const prioritized = (() => {
    if (!usedListEndpoint) return PATIENT_UPDATE_ENDPOINTS;

    // contoh: list = /admin/children -> update = /admin/children/:id
    const guess = (id: string) => `${usedListEndpoint.replace(/\/$/, "")}/${id}`;
    return [guess, ...PATIENT_UPDATE_ENDPOINTS];
  })();

  let lastErr: any = null;

  for (const build of prioritized) {
    const ep = typeof build === "function" ? build(child_id) : build;
    try {
      const res = await api.put(ep, payload);
      return { ok: true, usedEndpoint: ep, res: res.data };
    } catch (e: any) {
      lastErr = e;
      const status = e?.response?.status;
      if (status === 404) continue;
      throw e;
    }
  }

  const err = lastErr || new Error("Update endpoint tidak ditemukan");
  (err as any).__all404 = true;
  throw err;
}

export default function DataPasienPage() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<PatientItem | null>(null);

  const [usedEndpoint, setUsedEndpoint] = useState<string | null>(null);

  const endpointTriedText = useMemo(() => PATIENT_LIST_ENDPOINTS.join(", "), []);

  const load = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, usedEndpoint } = await fetchPatientsAuto();
      setUsedEndpoint(usedEndpoint);
      setPatients(data || []);
    } catch (e: any) {
      console.error("❌ fetchPatients error:", e);

      if (e?.__all404) {
        setErrorMsg(
          `Semua endpoint pasien tidak ditemukan (404). Endpoint yang dicoba: ${endpointTriedText}`
        );
      } else {
        setErrorMsg(e?.response?.data?.message || e?.message || "Gagal memuat data pasien");
      }

      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 text-[#36315B]">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-semibold">Data Pasien</h1>

            <button
              onClick={load}
              className="px-4 py-2 rounded-lg border border-[#81B7A9] hover:bg-[#E9F4F1]"
            >
              Refresh
            </button>
          </div>

          {usedEndpoint && (
            <p className="text-xs text-gray-500 mb-3">
              Endpoint aktif: <span className="font-medium">{usedEndpoint}</span>
            </p>
          )}

          {loading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : errorMsg ? (
            <div className="bg-white border rounded-lg p-4">
              <p className="text-red-600 font-medium">{errorMsg}</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-500">Belum ada data pasien.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patients.map((p) => (
                <div key={p.child_id} className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{p.child_name}</p>
                      <p className="text-sm text-gray-500">{p.child_birth_info || "-"}</p>
                      <p className="text-sm text-gray-500 capitalize">{p.child_gender || "-"}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelected(p);
                        setOpenEdit(true);
                      }}
                      className="px-3 py-1 text-sm rounded-lg border border-[#81B7A9] text-[#36315B] hover:bg-[#E9F4F1]"
                    >
                      Ubah
                    </button>
                  </div>

                  <div className="mt-3 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Sekolah:</span> {p.child_school || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Alamat:</span> {p.child_address || "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <FormUbahPatient
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelected(null);
        }}
        initialData={
          selected
            ? {
                child_name: selected.child_name || "",
                child_birth_info: selected.child_birth_info || "",
                child_birth_date: selected.child_birth_date || "",
                child_age: selected.child_age || "",
                child_gender: selected.child_gender ?? "",
                child_school: selected.child_school || "",
                child_address: selected.child_address || "",

                father_identity_number: selected.father_identity_number || "",
                father_name: selected.father_name || "",
                father_phone: selected.father_phone || "",
                father_birth_date: selected.father_birth_date || "",
                father_occupation: selected.father_occupation || "",
                father_relationship: selected.father_relationship || "",

                mother_identity_number: selected.mother_identity_number || "",
                mother_name: selected.mother_name || "",
                mother_phone: selected.mother_phone || "",
                mother_birth_date: selected.mother_birth_date || "",
                mother_occupation: selected.mother_occupation || "",
                mother_relationship: selected.mother_relationship || "",

                guardian_identity_number: selected.guardian_identity_number || "",
                guardian_name: selected.guardian_name || "",
                guardian_phone: selected.guardian_phone || "",
                guardian_birth_date: selected.guardian_birth_date || "",
                guardian_occupation: selected.guardian_occupation || "",
                guardian_relationship: selected.guardian_relationship || "",

                child_complaint: selected.child_complaint || "",
                child_service_choice: selected.child_service_choice || "",
              }
            : undefined
        }
        onUpdate={async (payload) => {
          if (!selected?.child_id) return;

          try {
            await updatePatientAuto(usedEndpoint, selected.child_id, payload);
            setOpenEdit(false);
            setSelected(null);
            await load();
          } catch (e: any) {
            console.error("❌ updatePatient error:", e);
            alert(e?.response?.data?.message || e?.message || "Gagal update data pasien");
          }
        }}
      />
    </div>
  );
}
