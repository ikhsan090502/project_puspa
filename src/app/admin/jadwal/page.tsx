"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { ClipboardList, FileText, Users, Search as SearchIcon, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import DatePicker from "@/components/dashboard/datepicker";

interface Jadwal {
  id: number;
  nama: string;
  usia: string;
  jenisKelamin: string;
  sekolah: string;
  orangtua: string;
  telepon: string;
  tanggalObservasi?: string;
  terapis?: string;
  jenisTerapi?: string;
  status?: "menunggu" | "terjadwal" | "selesai" | "dibatalkan";
}

export default function JadwalPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"menunggu" | "terjadwal" | "selesai">("menunggu");
  const [pageTab, setPageTab] = useState<"observasi" | "asesmen" | "terapi">("observasi");
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [selectedPasien, setSelectedPasien] = useState<Jadwal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJadwalData();
  }, [pageTab]);

  const fetchJadwalData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API based on pageTab
      const mockData: Jadwal[] = [
        {
          id: 1,
          nama: "Alief",
          usia: "8 Tahun 2 Bulan",
          jenisKelamin: "Laki-Laki",
          sekolah: "SD Sana sini",
          orangtua: "Ibu Sari",
          telepon: "081234567890",
          terapis: "Dr. Maya Sari",
          jenisTerapi: "Fisioterapi",
          status: "menunggu"
        },
        {
          id: 2,
          nama: "Rendra",
          usia: "10 Tahun 7 Bulan",
          jenisKelamin: "Perempuan",
          sekolah: "SD Kestalan",
          orangtua: "Ibu Eni",
          telepon: "081987654321",
          tanggalObservasi: "15/10/2024",
          terapis: "Dr. Ahmad Rahman",
          jenisTerapi: "Terapi Okupasi",
          status: "terjadwal"
        },
        {
          id: 3,
          nama: "Zamzam",
          usia: "11 Tahun 4 Bulan",
          jenisKelamin: "Laki-Laki",
          sekolah: "SD Kestalan",
          orangtua: "Ibu Setyo",
          telepon: "082345678901",
          tanggalObservasi: "10/10/2024",
          terapis: "Dr. Lisa Putri",
          jenisTerapi: "Terapi Wicara",
          status: "selesai"
        },
        {
          id: 4,
          nama: "Anisa",
          usia: "3 Tahun 2 Bulan",
          jenisKelamin: "Perempuan",
          sekolah: "-",
          orangtua: "Bapak Aditya",
          telepon: "083456789012",
          tanggalObservasi: "20/10/2024",
          terapis: "Dr. Budi Santoso",
          jenisTerapi: "PLB (Paedagog)",
          status: "terjadwal"
        },
      ];

      setJadwalList(mockData);
    } catch (error) {
      console.error("Error fetching jadwal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = jadwalList.filter(
    (j) =>
      j.nama.toLowerCase().includes(search.toLowerCase()) ||
      j.sekolah.toLowerCase().includes(search.toLowerCase()) ||
      j.orangtua.toLowerCase().includes(search.toLowerCase()) ||
      (j.terapis && j.terapis.toLowerCase().includes(search.toLowerCase()))
  );

  const displayed = filtered.filter((j) => {
    if (tab === "menunggu") return j.status === "menunggu";
    if (tab === "terjadwal") return j.status === "terjadwal";
    if (tab === "selesai") return j.status === "selesai";
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "menunggu":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "terjadwal":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "selesai":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "terjadwal":
        return "bg-blue-100 text-blue-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81B7A9] mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat jadwal...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Page Type Tabs */}
          <div className="flex justify-center gap-4 mt-2">
            {[
              { key: "observasi", label: "Observasi", icon: ClipboardList },
              { key: "asesmen", label: "Asesmen", icon: FileText },
              { key: "terapi", label: "Terapi", icon: Users },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setPageTab(item.key as "observasi" | "asesmen" | "terapi")}
                className={`flex items-center justify-center gap-2 min-w-[200px] px-6 py-3 rounded-full text-sm font-medium transition
                ${
                  pageTab === item.key
                    ? "bg-[#6D5BD0] text-white shadow-lg"
                    : "bg-[#81B7A9] text-white hover:bg-[#5f9d8f] hover:shadow-md"
                }`}
              >
                <item.icon size={18} />
                Jadwal {item.label}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              {[
                { key: "menunggu", label: "Menunggu", color: "text-yellow-600" },
                { key: "terjadwal", label: "Terjadwal", color: "text-blue-600" },
                { key: "selesai", label: "Selesai", color: "text-green-600" },
              ].map((statusTab) => (
                <button
                  key={statusTab.key}
                  onClick={() => setTab(statusTab.key as "menunggu" | "terjadwal" | "selesai")}
                  className={`relative pb-2 text-sm font-medium transition ${
                    tab === statusTab.key
                      ? `text-[#36315B] border-b-2 border-[#81B7A9] font-semibold`
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {statusTab.label}
                  <span className={`ml-2 text-xs ${statusTab.color}`}>
                    ({jadwalList.filter(j => j.status === statusTab.key).length})
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Cari pasien, terapis, atau orang tua..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#ADADAD] rounded-full pl-4 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
              />
              <SearchIcon size={16} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total {pageTab === "observasi" ? "Observasi" : pageTab === "asesmen" ? "Asesmen" : "Terapi"}</p>
                  <p className="text-2xl font-bold text-[#36315B]">{jadwalList.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-[#81B7A9]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-600">{jadwalList.filter(j => j.status === "menunggu").length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terjadwal</p>
                  <p className="text-2xl font-bold text-blue-600">{jadwalList.filter(j => j.status === "terjadwal").length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{jadwalList.filter(j => j.status === "selesai").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[#36315B]">
                  <th className="p-3 text-left">Nama Pasien</th>
                  <th className="p-3 text-left">Usia</th>
                  <th className="p-3 text-left">Jenis Kelamin</th>
                  <th className="p-3 text-left">Sekolah</th>
                  <th className="p-3 text-left">Orang Tua</th>
                  <th className="p-3 text-left">Terapis</th>
                  <th className="p-3 text-left">Jenis Terapi</th>
                  <th className="p-3 text-left">Tanggal</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((j) => (
                  <tr key={j.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-[#36315B] font-medium">{j.nama}</td>
                    <td className="p-3 text-[#36315B]">{j.usia}</td>
                    <td className="p-3 text-[#36315B]">{j.jenisKelamin}</td>
                    <td className="p-3 text-[#36315B]">{j.sekolah}</td>
                    <td className="p-3 text-[#36315B]">{j.orangtua}</td>
                    <td className="p-3 text-[#36315B]">{j.terapis || "-"}</td>
                    <td className="p-3 text-[#36315B]">{j.jenisTerapi || "-"}</td>
                    <td className="p-3 text-[#36315B]">{j.tanggalObservasi || "-"}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(j.status || "menunggu")}`}>
                        {getStatusIcon(j.status || "menunggu")}
                        {j.status === "menunggu" ? "Menunggu" :
                         j.status === "terjadwal" ? "Terjadwal" :
                         j.status === "selesai" ? "Selesai" : "Dibatalkan"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {j.status === "menunggu" ? (
                        <button
                          onClick={() => setSelectedPasien(j)}
                          className="px-3 py-1 text-xs rounded bg-[#81B7A9] hover:bg-[#36315B] text-white transition"
                        >
                          Atur Jadwal
                        </button>
                      ) : j.status === "terjadwal" ? (
                        <button
                          onClick={() => setSelectedPasien(j)}
                          className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                          Edit Jadwal
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 text-xs rounded bg-green-600 text-white cursor-not-allowed"
                          disabled
                        >
                          Selesai
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {displayed.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data {pageTab} dengan status {tab}
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedPasien && (
        <DatePicker
          pasien={selectedPasien}
          initialDate={selectedPasien.tanggalObservasi}
          onClose={() => setSelectedPasien(null)}
          onSave={(date) => {
            setJadwalList((prev) =>
              prev.map((p) =>
                p.id === selectedPasien.id
                  ? { ...p, tanggalObservasi: date.toLocaleDateString("id-ID"), status: "terjadwal" }
                  : p
              )
            );
            setSelectedPasien(null);
            alert("Jadwal berhasil diperbarui!");
          }}
        />
      )}
    </div>
  );
}