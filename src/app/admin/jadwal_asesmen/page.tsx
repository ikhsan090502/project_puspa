"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import {
  Search as SearchIcon,
  Settings,
  ChevronDown,
  Eye,
  Clock3,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getObservations, Jadwal } from "@/lib/api/jadwal_observasi";
import { useRouter } from "next/navigation";
import FormAturAsesmen from "@/components/form/FormAturAsesmen";

export default function JadwalAsesmenPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"terjadwal" | "selesai">("terjadwal");
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [originalList, setOriginalList] = useState<Jadwal[]>([]);
  const [selectedPasien, setSelectedPasien] = useState<Jadwal | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openAsesmen, setOpenAsesmen] = useState(false);

  const fetchJadwal = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = tab === "terjadwal" ? "scheduled" : "completed";
      const data = await getObservations(status);
      setJadwalList(data);
      setOriginalList(data);
    } catch (err) {
      console.error("Gagal memuat data jadwal:", err);
      setError("Gagal memuat data jadwal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
    setSelectedDate(null);
  }, [tab]);

  const filtered = jadwalList.filter((j) => {
    const nama = j.nama?.toLowerCase() || "";
    const sekolah = j.sekolah?.toLowerCase() || "";
    const orangtua = j.orangtua?.toLowerCase() || "";
    const q = search.toLowerCase();
    return nama.includes(q) || sekolah.includes(q) || orangtua.includes(q);
  });

  const handleDateSelect = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd", { locale: id });
    setSelectedDate(formatted);
    const filteredData = originalList.filter(
      (j) => j.tanggalObservasi === formatted
    );
    setJadwalList(filteredData);
  };

  const handleRiwayatJawaban = (id: string) => {
    router.push(`/terapis/riwayat-hasil?id=${id}`);
  };

  const handleLihatHasil = (id: string) => {
    router.push(`/terapis/hasil-observasi?id=${id}`);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const DualCalendar = () => {
    const today = selectedDate ? new Date(selectedDate) : new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    return (
      <div className="flex justify-center gap-6 bg-[#F9FAFB] p-4 rounded-lg">
        <Calendar
          onChange={handleDateSelect}
          locale="id-ID"
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          value={today}
        />
        <Calendar
          onChange={handleDateSelect}
          locale="id-ID"
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          value={nextMonth}
        />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <Header />

        <main className="p-6 space-y-6 relative">
          <h1 className="text-2xl font-semibold text-[#36315B] mb-2">
            Jadwal Asesmen
          </h1>

          {tab === "terjadwal" && <DualCalendar />}

          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-6">
              {["terjadwal", "selesai"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`relative pb-2 text-sm font-medium ${
                    tab === t
                      ? "text-[#36315B] border-b-2 border-[#81B7A9] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "terjadwal" ? "Terjadwal" : "Selesai"}
                </button>
              ))}
            </div>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Cari Pasien"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#ADADAD] rounded-full pl-3 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
              <SearchIcon
                size={16}
                className="absolute right-3 top-2.5 text-gray-400"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            {loading ? (
              <p className="text-center text-gray-500 py-10">
                Memuat data...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 py-10">{error}</p>
            ) : filtered.length === 0 ? (
              selectedDate && tab === "terjadwal" ? (
                <p className="text-center text-gray-500 py-10">
                  Tidak ada jadwal untuk tanggal{" "}
                  {format(new Date(selectedDate), "dd MMMM yyyy", { locale: id })}
                </p>
              ) : (
                <p className="text-center text-gray-500 py-10">
                  Tidak ada data.
                </p>
              )
            ) : tab === "selesai" ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B] bg-gray-50">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Observer</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Tanggal Observasi</th>
                    <th className="p-3 text-left">Waktu</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr
                      key={j.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3">{j.nama}</td>
                      <td className="p-3">{j.orangtua}</td>
                      <td className="p-3">{j.observer || "-"}</td>
                      <td className="p-3 capitalize">{j.status || "completed"}</td>
                      <td className="p-3">{j.tanggalObservasi || "-"}</td>
                      <td className="p-3">{j.waktu || "-"}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPasien(j);
                            setOpenDropdown(true);
                          }}
                          className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded hover:bg-[#E9F4F1] text-xs inline-flex items-center"
                        >
                          <Settings size={14} className="mr-1" />
                          Aksi
                          <ChevronDown size={12} className="ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B]">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Usia</th>
                    <th className="p-3 text-left">Jenis Kelamin</th>
                    <th className="p-3 text-left">Sekolah</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Telepon</th>
                    <th className="p-3 text-left">Tanggal Observasi</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr key={j.id} className="border-b border-gray-100">
                      <td className="p-3">{j.nama || "-"}</td>
                      <td className="p-3">{j.usia || "-"}</td>
                      <td className="p-3">{j.jenisKelamin || "-"}</td>
                      <td className="p-3">{j.sekolah || "-"}</td>
                      <td className="p-3">{j.orangtua || "-"}</td>
                      <td className="p-3">{j.telepon || "-"}</td>
                      <td className="p-3">{j.tanggalObservasi || "-"}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedPasien(j);
                            setOpenAsesmen(true);
                          }}
                          className="px-4 py-1 text-sm rounded bg-[#81B7A9] hover:bg-[#36315B] text-white transition"
                        >
                          Edit Observasi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {openDropdown && selectedPasien && (
            <div
              className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50 bg-white border border-[#80C2B0] shadow-xl rounded-lg w-64 text-[#5F52BF]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="divide-y divide-gray-200">
                <button
                  onClick={() => {
                    setOpenAsesmen(true);
                    setOpenDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
                >
                  <Settings size={16} className="mr-2" />
                  Atur Asesmen
                </button>
                <button
                  onClick={() => {
                    setOpenDropdown(false);
                    handleRiwayatJawaban(selectedPasien.id);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
                >
                  <Clock3 size={16} className="mr-2" />
                  Riwayat Jawaban
                </button>
                <button
                  onClick={() => {
                    setOpenDropdown(false);
                    handleLihatHasil(selectedPasien.id);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
                >
                  <Eye size={16} className="mr-2" />
                  Lihat Hasil
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {openAsesmen && selectedPasien && (
        <FormAturAsesmen
          title={tab === "terjadwal" ? "Edit Observasi" : "Atur Asesmen"}
          pasienName={selectedPasien.nama}
          initialDate={selectedPasien.tanggalObservasi || ""}
          initialTime={selectedPasien.waktu || ""}
          onClose={() => {
            setOpenAsesmen(false);
            setSelectedPasien(null);
          }}
          onSave={(date, time) => {
            console.log(
              tab === "selesai"
                ? "🔹 Simpan Asesmen:"
                : "🔹 Simpan Observasi:",
              "\nTanggal:",
              date,
              "\nWaktu:",
              time,
              "\nPasien:",
              selectedPasien.nama
            );
          }}
        />
      )}
    </div>
  );
}
