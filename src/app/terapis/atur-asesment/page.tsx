"use client";

import { useState, useEffect } from "react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import DatePicker from "@/components/dashboard/datepicker";

interface Patient {
  id: string;
  nama: string;
  usia: string;
  jenisKelamin: string;
  namaOrangTua: string;
  terapi: string;
  statusAsesmen: string;
}

export default function AturAsesmentPage() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for patients
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      nama: "Alya",
      usia: "10 Tahun 3 Bulan",
      jenisKelamin: "Perempuan",
      namaOrangTua: "Sahroni",
      terapi: "PLB (Paedagog)",
      statusAsesmen: "Belum Dijadwalkan"
    },
    {
      id: "2",
      nama: "Raka",
      usia: "8 Tahun",
      jenisKelamin: "Laki-laki",
      namaOrangTua: "Budi",
      terapi: "Terapi Okupasi",
      statusAsesmen: "Belum Dijadwalkan"
    },
    {
      id: "3",
      nama: "Nina",
      usia: "9 Tahun",
      jenisKelamin: "Perempuan",
      namaOrangTua: "Siti",
      terapi: "Terapi Wicara",
      statusAsesmen: "Dijadwalkan: 2024-01-15"
    },
    {
      id: "4",
      nama: "Fajar",
      usia: "11 Tahun",
      jenisKelamin: "Laki-laki",
      namaOrangTua: "Hendra",
      terapi: "Fisioterapi",
      statusAsesmen: "Dijadwalkan: 2024-01-20"
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = () => {
    console.log("Tanggal asesmen berhasil diperbarui!");
    setRefreshKey((prev) => prev + 1);
    setOpen(false);
    setSelectedPatient(null);
    setSelectedDate(null);

    // Update patient status in mock data
    if (selectedPatient) {
      setPatients(prev => prev.map(p =>
        p.id === selectedPatient.id
          ? { ...p, statusAsesmen: `Dijadwalkan: ${new Date().toLocaleDateString('id-ID')}` }
          : p
      ));
    }
  };

  const handleScheduleAssessment = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-lg">
      Memuat data pasien...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Atur Jadwal Asesmen
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Daftar Pasien yang Perlu Dijadwalkan Asesmen
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nama</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Usia</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Jenis Kelamin</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nama Orang Tua</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Terapi</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status Asesmen</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{patient.nama}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{patient.usia}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{patient.jenisKelamin}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{patient.namaOrangTua}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{patient.terapi}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          patient.statusAsesmen.includes('Belum')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.statusAsesmen}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => handleScheduleAssessment(patient)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs"
                        >
                          {patient.statusAsesmen.includes('Belum') ? 'Jadwalkan' : 'Ubah Jadwal'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Pasien</h3>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Belum Dijadwalkan</h3>
              <p className="text-2xl font-bold text-red-600">
                {patients.filter(p => p.statusAsesmen.includes('Belum')).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Sudah Dijadwalkan</h3>
              <p className="text-2xl font-bold text-green-600">
                {patients.filter(p => p.statusAsesmen.includes('Dijadwalkan')).length}
              </p>
            </div>
          </div>

          {open && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  Jadwalkan Asesmen untuk {selectedPatient.nama}
                </h3>
                <DatePicker
                  pasien={{
                    id: parseInt(selectedPatient.id),
                    observation_id: `OBS${selectedPatient.id}`,
                    nama: selectedPatient.nama
                  }}
                  initialDate={selectedDate || undefined}
                  onClose={() => {
                    setOpen(false);
                    setSelectedPatient(null);
                  }}
                  onUpdate={handleUpdate}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
