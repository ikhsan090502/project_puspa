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
import { useRouter } from "next/navigation";
import FormEditAsesment from "@/components/form/FormEditAsesment";
import { getAssessmentsAdmin } from "@/lib/api/jadwal_asessment";
import FormDetailAsesment from "@/components/form/FormDetailAsesment";


// =======================
// Interface Jadwal
// =======================
export interface Jadwal {
  id: number;
  nama: string;
  usia?: string;
  jenisKelamin?: string;
  sekolah?: string;
  orangtua: string;
  telepon: string;
  asessor?: string;
  administrator?: string;
  tipe?: string;
  tanggalObservasi?: string | null;
  waktu?: string | null;
  observer?: string | null;
  status?: string | null;
}

const ORTU_ACTIONS = [
  { key: "umum", label: "Data Umum" },
  { key: "fisio", label: "Data Fisioterapi" },
  { key: "okupasi", label: "Data Terapi Okupasi" },
  { key: "wicara", label: "Data Terapi Wicara" },
  { key: "paedagog", label: "Data Paedagog" },
  { key: "upload", label: "Upload File" },
];

const ASESSOR_ACTIONS = [
  { key: "fisio", label: "Data Fisioterapi" },
  { key: "okupasi", label: "Data Terapi Okupasi" },
  { key: "wicara", label: "Data Terapi Wicara" },
  { key: "paedagog", label: "Data Paedagog" },
];




// =======================
// Page Component (tidak berubah)
// =======================
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
  const [openDetail, setOpenDetail] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<{
    id: number;
    role: "ortu" | "asessor";
  } | null>(null);
  const [openAsesmen, setOpenAsesmen] = useState(false);
  const fetchJadwal = async () => {
    setLoading(true);
    setError(null);

    try {
      const status = tab === "terjadwal" ? "scheduled" : "completed";
      const data = await getAssessmentsAdmin(status);
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
  const filtered = originalList.filter((j) => {
    const q = search.toLowerCase();

    const matchSearch =
      (j.nama || "").toLowerCase().includes(q) ||
      (j.sekolah || "").toLowerCase().includes(q) ||
      (j.orangtua || "").toLowerCase().includes(q);

    const matchDate =
      tab === "terjadwal" && selectedDate
        ? j.tanggalObservasi === selectedDate
        : true;

    return matchSearch && matchDate;
  });


  const handleDateSelect = (date: Date) => {
    const formatted = format(date, "dd/MM/yyyy");
    setSelectedDate(formatted);
  };



  const handleOrtuRoute = (action: string, jadwalId: number) => {
    const base = "/admin/ortu";

    const routes: Record<string, string> = {
      umum: `${base}/data_umum`,
      fisio: `${base}/fisioterapi`,
      okupasi: `${base}/okupasi`,
      wicara: `${base}/wicara`,
      paedagog: `${base}/paedagog`,
      upload: `${base}/upload_file`,
    };

router.push(`${routes[action]}?assessment_id=${jadwalId}`);
  };

  const handleAsessorRoute = (action: string, jadwalId: number) => {
    const base = "/admin/asesor";

    const routes: Record<string, string> = {
      fisio: `${base}/fisioterapi`,
      okupasi: `${base}/okupasi`,
      wicara: `${base}/wicara`,
      paedagog: `${base}/paedagog`,
    };

    router.push(`${routes[action]}?id=${jadwalId}`);
  };


  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

const DualCalendar = () => {
  const parseSelectedDate = () => {
    if (!selectedDate) return new Date();

    const parts = selectedDate.split("/");
    if (parts.length !== 3) return new Date();

    const [d, m, y] = parts;
    const parsed = new Date(`${y}-${m}-${d}`);

    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const currentDate = parseSelectedDate();
  const nextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  return (
    <div className="flex justify-center gap-6 bg-[#F9FAFB] p-4 rounded-lg">
      <Calendar
        onChange={handleDateSelect}
        locale="id-ID"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        value={currentDate}
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
                  className={`relative pb-2 text-sm font-medium ${tab === t
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
              <p className="text-center text-gray-500 py-10">Memuat data...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-10">{error}</p>
            ) : filtered.length === 0 ? (
              selectedDate && tab === "terjadwal" ? (
                <p className="text-center text-gray-500 py-10">
                  Tidak ada jadwal untuk tanggal{" "}
                  {(() => {
                    const [d, m, y] = selectedDate.split("/");
                    return format(new Date(`${y}-${m}-${d}`), "dd MMMM yyyy", { locale: id });
                  })()}
                </p>
              ) : (
                <p className="text-center text-gray-500 py-10">Tidak ada data.</p>
              )
            ) : tab === "selesai" ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B]">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Telepon</th>
                    <th className="p-3 text-left">Tipe Assesment</th>
                    <th className="p-3 text-left">Asessor</th>
                    <th className="p-3 text-left">Tanggal Assesment</th>
                    <th className="p-3 text-left">Waktu</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr key={j.id} className="border-b border-gray-100">
                      <td className="p-3">{j.nama}</td>
                      <td className="p-3">{j.orangtua}</td>
                      <td className="p-3">{j.telepon}</td>
                      <td className="p-3">{j.tipe}</td>
                      <td className="p-3">{j.asessor}</td>
                      <td className="p-3">{j.tanggalObservasi}</td>
                      <td className="p-3">{j.waktu}</td>
                      <td className="p-3 text-center relative">
                        <div className="flex justify-center gap-2">
                          {/* BUTTON ORTU */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown?.id === j.id && openDropdown?.role === "ortu"
                                  ? null
                                  : { id: j.id, role: "ortu" }
                              );
                            }}
                            className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded hover:bg-[#E9F4F1] text-xs inline-flex items-center"
                          >
                            Ortu
                            <ChevronDown size={12} className="ml-1" />
                          </button>

                          {/* BUTTON ASESSOR */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown?.id === j.id && openDropdown?.role === "asessor"
                                  ? null
                                  : { id: j.id, role: "asessor" }
                              );
                            }}
                            className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded hover:bg-[#E9F4F1] text-xs inline-flex items-center"
                          >
                            Asessor
                            <ChevronDown size={12} className="ml-1" />
                          </button>
                        </div>

                        {/* DROPDOWN ORTU */}
                        {openDropdown?.id === j.id && openDropdown?.role === "ortu" && (
                          <div
                            className="absolute right-0 mt-2 z-50 bg-white border border-[#80C2B0] shadow-xl rounded-lg w-64"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {ORTU_ACTIONS.map((item) => (
                              <button
                                key={item.key}
                                onClick={() => {
                                  handleOrtuRoute(item.key, j.id);
                                  setOpenDropdown(null);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-[#E9F4F1]"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* DROPDOWN ASESSOR */}
                        {openDropdown?.id === j.id && openDropdown?.role === "asessor" && (
                          <div
                            className="absolute right-0 mt-2 z-50 bg-white border border-[#80C2B0] shadow-xl rounded-lg w-64"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {ASESSOR_ACTIONS.map((item) => (
                              <button
                                key={item.key}
                                onClick={() => {
                                  handleAsessorRoute(item.key, j.id);
                                  setOpenDropdown(null);
                                }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-[#E9F4F1]"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B] bg-gray-50">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Telepon</th>
                    <th className="p-3 text-left">Tipe Assesment</th>
                    <th className="p-3 text-left">Administrator</th>
                    <th className="p-3 text-left">Tanggal Assesment</th>
                    <th className="p-3 text-left">Waktu</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr key={j.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{j.nama}</td>
                      <td className="p-3">{j.orangtua}</td>
                      <td className="p-3">{j.telepon}</td>
                      <td className="p-3">{j.tipe}</td>
                      <td className="p-3">{j.administrator}</td>
                      <td className="p-3">{j.tanggalObservasi}</td>
                      <td className="p-3">{j.waktu}</td>
                      <td className="p-3 text-center relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPasien(j);
                            setOpenDropdown(openDropdown === j.id ? null : j.id);
                          }}
                          className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded hover:bg-[#E9F4F1] text-xs inline-flex items-center"
                        >
                          <Settings size={14} className="mr-1" />
                          Aksi
                          <ChevronDown size={12} className="ml-1" />
                        </button>

                        {/* DROPDOWN AKSI — SAMA DENGAN OBSERVASI */}
                        {openDropdown === j.id && tab === "terjadwal" && (
                          <div
                            className="absolute right-0 mt-2 z-50 bg-white border border-[#80C2B0] shadow-xl rounded-lg w-56 text-[#5F52BF]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="divide-y divide-gray-200">
                              {/* ATUR ASESMEN */}
                              <button
                                onClick={() => {
                                  setOpenAsesmen(true);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
                              >
                                <Settings size={16} className="mr-2" />
                                Atur Asesmen
                              </button>

                              {/* DETAIL */}
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  setOpenDetail(true);
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
                              >
                                <Eye size={16} className="mr-2" />
                                Detail
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>



        </main>
      </div>

      {openAsesmen && selectedPasien && (
        <FormEditAsesment
          title={tab === "terjadwal" ? "Edit Asesment" : "Atur Asesment"}
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
      <FormDetailAsesment
        open={openDetail}
        pasien={selectedPasien}
        onClose={() => {
          setOpenDetail(false);
          setSelectedPasien(null);
        }}
      />
    </div>
  );
}
