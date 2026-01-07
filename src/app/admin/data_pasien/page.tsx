"use client";

import React, { useEffect, useState } from "react";
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
  | { success?: boolean; data?: T[]; message?: string };

async function fetchPatients(): Promise<PatientItem[]> {
  // ✅ ganti endpoint sesuai backend Anda
  const res = await api.get<ApiListResponse<PatientItem>>("/admin/patients");

  const body = res.data;

  // handle beberapa kemungkinan bentuk response
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;

  return [];
}

async function updatePatient(child_id: string, payload: any) {
  // ✅ ganti endpoint sesuai backend Anda
  const res = await api.put(`/admin/patients/${child_id}`, payload);
  return res.data;
}

export default function DataPasienPage() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<PatientItem | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await fetchPatients();
      setPatients(data || []);
    } catch (e: any) {
      console.error("❌ fetchPatients error:", e);
      setErrorMsg(e?.response?.data?.message || e?.message || "Gagal memuat data pasien");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 text-[#36315B]">
          <h1 className="text-2xl font-semibold mb-4">Data Pasien</h1>

          {loading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : errorMsg ? (
            <div className="bg-white border rounded-lg p-4">
              <p className="text-red-600 font-medium">{errorMsg}</p>
              <button
                onClick={load}
                className="mt-3 px-4 py-2 rounded-lg border border-[#81B7A9] hover:bg-[#E9F4F1]"
              >
                Coba lagi
              </button>
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

          await updatePatient(selected.child_id, payload);

          setOpenEdit(false);
          setSelected(null);
          await load();
        }}
      />
    </div>
  );
}
