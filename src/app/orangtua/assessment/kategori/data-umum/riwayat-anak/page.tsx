
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { ChevronDown, Plus, Trash } from "lucide-react";

import {
  getParentAssessmentQuestions,
  submitParentAssessment,
} from "@/lib/api/asesmentTerapiOrtu";

/* =======================
   HELPERS
========================== */
const safeJsonParse = (str: any, fallback: any) => {
  if (str === null || str === undefined) return fallback;
  if (typeof str !== "string") return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn("safeJsonParse failed:", e, str);
    return fallback;
  }
};

const makeDefaultAnswerForQuestion = (q: any) => {
  const t = q.answer_type;
  if (t === "checkbox") return [];
  if (t === "multi") return [];
  if (t === "table") return {};
  if (t === "radio_with_text") return { value: "", note: "" };
  return "";
};

/* =======================
   MAIN COMPONENT
========================== */
export default function FormAssessmentOrangtua() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assessmentIdFromQuery = searchParams?.get("assessment_id") || null;

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" }
  ];

  const [groups, setGroups] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("identitas");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  /* =======================
     LOAD QUESTIONS
  ========================== */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const resp: any = await getParentAssessmentQuestions("parent_general");

        const list =
          Array.isArray(resp?.data?.groups) ? resp.data.groups :
          Array.isArray(resp?.groups) ? resp.groups :
          Array.isArray(resp?.data) ? resp.data :
          [];

        // Tambahkan grup Identitas
        list.unshift({
          group_key: "identitas",
          title: "Identitas Anak & Orangtua",
          questions: []  
        });

        if (!mounted) return;
        setGroups(list);

        if (list.length > 0) {
          setActiveCategory((prev) => prev || list[0].group_key);
        }

        const init: Record<string, any> = {};
        list.forEach((g: any) => {
          (g.questions || []).forEach((q: any) => {
            init[q.id] = makeDefaultAnswerForQuestion(q);
          });
        });

        if (mounted) setAnswers(init);
      } catch (e) {
        console.error("failed:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false };
  }, []);



  /* =======================
     DERIVED CURRENT QUESTIONS
  ========================== */
  const currentQuestions =
    groups.find((g) => g.group_key === activeCategory)?.questions || [];

  /* =======================
     SETTERS
  ========================== */
  const setAnswer = (qid: any, value: any) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const toggleCheckboxValue = (qid: any, val: any) => {
    setAnswers((prev) => {
      const arr = Array.isArray(prev[qid]) ? prev[qid] : [];
      return {
        ...prev,
        [qid]: arr.includes(val)
          ? arr.filter((v: any) => v !== val)
          : [...arr, val]
      };
    });
  };

  const handleTableCell = (qid: any, rowKey: string, value: any) => {
    setAnswers((prev) => {
      const base = typeof prev[qid] === "object" ? prev[qid] : {};
      return { ...prev, [qid]: { ...base, [rowKey]: value } };
    });
  };

  /* =======================
     SUBMIT
  ========================== */
  const handleSubmit = async (e?: any) => {
    if (e) e.preventDefault();
    const id = assessmentIdFromQuery || "GENERAL-001";
    setSubmitting(true);

    try {
      await submitParentAssessment(id, "umum_parent", { answers });
      alert("Berhasil disimpan.");
      router.push("/orangtua/assessment");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================
     RENDER
  ========================== */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarOrangtua />

      <div className="flex-1 flex flex-col ml-64">
        <HeaderOrangtua />

        <main className="flex-1 p-8 overflow-y-auto">

          {/* STEP NAVIGATOR */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center cursor-pointer"
                  onClick={() => router.push(step.path)}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium ${i === activeStep ? "text-[#36315B]" : "text-gray-500"}`}>
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />}
                </div>
              ))}
            </div>
          </div>



          {/* CONTENT BOX */}
          <section className="bg-white rounded-2xl shadow-sm border p-8 max-w-5xl mx-auto">

            {/* TITLE + DROPDOWN */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#36315B]">I. Data Umum</h2>

              <div className="relative inline-block">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-[#36315B]"
                >
                  {groups.map((g) => (
                    <option key={g.group_key} value={g.group_key}>
                      {g.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* ==========================
                IDENTITAS (STATIC PAGE)
            =========================== */}
            
            {activeCategory === "identitas" && (
  <form
    onSubmit={handleSubmit}
    className="space-y-10 mb-10"
  >
    {/* ==========================
        1. ANAK
    =========================== */}
    <div>
      <h3 className="font-semibold text-[#36315B] text-base mb-4">1. Anak</h3>

      <div className="grid grid-cols-2 gap-6 text-sm">

        {/* Nama Anak */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Nama</label>
          <input
            className="w-full border border-gray-300 p-2 rounded-md bg-gray-50"
            defaultValue="Zahara Prameswari"
            name="nama_anak"
          />
        </div>

        {/* Tanggal Lahir */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Tanggal Lahir</label>
          <input
            className="w-full border border-gray-300 p-2 rounded-md bg-gray-50"
            defaultValue="26 Agustus 2015"
            name="tanggal_lahir_anak"
          />
        </div>

        {/* Alamat Anak */}
        <div className="flex flex-col col-span-2">
          <label className="font-medium mb-1">Alamat</label>
          <input
            className="w-full border border-gray-300 p-2 rounded-md bg-gray-50"
            defaultValue="Jln. Malabar Selatan 10"
            name="alamat_anak"
          />
        </div>

      </div>
    </div>

    {/* ==========================
        2. ORANGTUA
    =========================== */}
    <div>
      <h3 className="font-semibold text-[#36315B] text-base mb-6">2. Orangtua</h3>

      {/* ---------------- Ayah ---------------- */}
      <h4 className="font-semibold text-[#36315B] text-sm mb-3">Ayah</h4>

      <div className="grid grid-cols-2 gap-6 text-sm mb-8">

        <div className="flex flex-col">
          <label className="mb-1">Nama Ayah</label>
          <input className="border p-2 rounded-md" placeholder="Moko" name="nama_ayah" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Tanggal Lahir</label>
          <input className="border p-2 rounded-md" placeholder="DD/MM/YYYY" name="tanggal_lahir_ayah" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Pekerjaan</label>
          <input className="border p-2 rounded-md" placeholder="Karyawan Swasta" name="pekerjaan_ayah" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Nomor Telpon</label>
          <input className="border p-2 rounded-md" placeholder="0811-xxxx-xxxx" name="telpon_ayah" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Hubungan dengan anak</label>
          <input className="border p-2 rounded-md" placeholder="Ayah kandung" name="hubungan_ayah" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">NIK</label>
          <input className="border p-2 rounded-md" placeholder="33720001897098754" name="nik_ayah" />
        </div>
      </div>

      {/* ---------------- Ibu ---------------- */}
      <h4 className="font-semibold text-[#36315B] text-sm mb-3">Ibu</h4>

      <div className="grid grid-cols-2 gap-6 text-sm mb-8">

        <div className="flex flex-col">
          <label className="mb-1">Nama Ibu</label>
          <input className="border p-2 rounded-md" placeholder="Moko" name="nama_ibu" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Tanggal Lahir</label>
          <input className="border p-2 rounded-md" placeholder="DD/MM/YYYY" name="tanggal_lahir_ibu" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Pekerjaan</label>
          <input className="border p-2 rounded-md" placeholder="Ibu Rumah Tangga" name="pekerjaan_ibu" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Nomor Telpon</label>
          <input className="border p-2 rounded-md" placeholder="0811-xxxx-xxxx" name="telpon_ibu" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Hubungan dengan anak</label>
          <input className="border p-2 rounded-md" placeholder="Ibu kandung" name="hubungan_ibu" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">NIK</label>
          <input className="border p-2 rounded-md" placeholder="337200917263548" name="nik_ibu" />
        </div>
      </div>

      {/* ---------------- Wali ---------------- */}
      <h4 className="font-semibold text-[#36315B] text-sm mb-3">Wali</h4>

      <div className="grid grid-cols-2 gap-6 text-sm">

        <div className="flex flex-col">
          <label className="mb-1">Nama Wali</label>
          <input className="border p-2 rounded-md" placeholder="-" name="nama_wali" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Tanggal Lahir</label>
          <input className="border p-2 rounded-md" placeholder="DD/MM/YYYY" name="tanggal_lahir_wali" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Pekerjaan</label>
          <input className="border p-2 rounded-md" placeholder="-" name="pekerjaan_wali" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Nomor Telpon</label>
          <input className="border p-2 rounded-md" placeholder="-" name="telpon_wali" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Hubungan dengan Anak</label>
          <input className="border p-2 rounded-md" placeholder="-" name="hubungan_wali" />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">NIK</label>
          <input className="border p-2 rounded-md" placeholder="-" name="nik_wali" />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1">Alamat</label>
          <input className="border p-2 rounded-md" placeholder="-" name="alamat_wali" />
        </div>
      </div>

    </div>

    {/* SIMPAN BUTTON */}
    <div className="flex justify-end pt-6">
      <button
        type="submit"
        disabled={submitting}
        className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-8 py-2 rounded-xl disabled:opacity-60"
      >
        {submitting ? "Mengirim..." : "Simpan"}
      </button>
    </div>
  </form>
)}

            {/* ==========================
                DYNAMIC QUESTIONS
            =========================== */}
            {activeCategory !== "identitas" && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {loading ? (
                  <p>Memuat pertanyaan...</p>
                ) : currentQuestions.length === 0 ? (
                  <p>Tidak ada pertanyaan di kategori ini.</p>
                ) : (
                  currentQuestions.map((q: any) => {
                    const extra = safeJsonParse(q.extra_schema, {});
                    const options = Array.isArray(extra?.options)
                      ? extra.options
                      : safeJsonParse(q.answer_options, []);

                    return (
                      <div key={q.id}>
                        <label className="block font-medium text-gray-700 mb-1">
                          {q.question_number ? `${q.question_number}. ` : ""}
                          {q.question_text}
                        </label>

                        {/* TEXT */}
                        {q.answer_type === "text" && (
                          <input
                            className="border rounded-md p-2 w-full text-sm"
                            value={answers[q.id] ?? ""}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                          />
                        )}

                        {/* NUMBER */}
                        {q.answer_type === "number" && (
                          <input
                            type="number"
                            className="border rounded-md p-2 w-32"
                            value={answers[q.id] ?? ""}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                          />
                        )}

                        {/* TEXTAREA */}
                        {q.answer_type === "textarea" && (
                          <textarea
                            rows={3}
                            className="border rounded-md p-2 w-full"
                            value={answers[q.id] ?? ""}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                          />
                        )}

                        {/* SELECT */}
                        {q.answer_type === "select" && (
                          <select
                            className="border rounded-md p-2 text-sm"
                            value={answers[q.id] ?? ""}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                          >
                            <option value="">Pilih salah satu</option>
                            {options.map((opt: any, idx: number) => (
                              <option key={idx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}

                        {/* RADIO */}
                        {q.answer_type === "radio" && (
                          <div className="flex gap-6 mt-2 flex-wrap">
                            {options.map((opt: any, idx: number) => (
                              <label key={idx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`radio-${q.id}`}
                                  value={opt}
                                  checked={answers[q.id] === opt}
                                  onChange={(e) => setAnswer(q.id, e.target.value)}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}

                        {/* CHECKBOX */}
                        {q.answer_type === "checkbox" && (
                          <div className="flex gap-6 mt-2 flex-wrap">
                            {options.map((opt: any, idx: number) => (
                              <label key={idx} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                                  onChange={() => toggleCheckboxValue(q.id, opt)}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}

                        {/* RADIO WITH TEXT */}
                        {q.answer_type === "radio_with_text" && (
                          <div className="mt-2 space-y-3">
                            {options.map((opt: any, idx: number) => (
                              <label key={idx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`radio-${q.id}`}
                                  value={opt}
                                  checked={answers[q.id]?.value === opt}
                                  onChange={() => setAnswer(q.id, { value: opt, note: "" })}
                                />
                                {opt}
                              </label>
                            ))}

                            {(answers[q.id]?.value === "Tidak" ||
                              answers[q.id]?.value === "Belum Imunisasi" ||
                              answers[q.id]?.value === "Tidak Lengkap") && (
                              <input
                                className="border rounded-md p-2 w-full text-sm"
                                value={answers[q.id]?.note ?? ""}
                                onChange={(e) =>
                                  setAnswer(q.id, { ...(answers[q.id] || {}), note: e.target.value })
                                }
                                placeholder="Keterangan"
                              />
                            )}
                          </div>
                        )}

                        {/* MULTI INPUT */}
                        {q.answer_type === "multi" && (
                          <div className="space-y-3 mt-2">
                            {Array.isArray(answers[q.id]) &&
                              answers[q.id].map((row: any, index: number) => (
                                <div key={index} className="flex items-center gap-4">
                                  {(extra?.fields || ["Nama", "Usia"]).map((f: string) => (
                                    <input
                                      key={f}
                                      className="border p-2 rounded-md text-sm"
                                      value={row[f] || ""}
                                      onChange={(e) => {
                                        const up = [...answers[q.id]];
                                        up[index] = { ...up[index], [f]: e.target.value };
                                        setAnswer(q.id, up);
                                      }}
                                      placeholder={f}
                                    />
                                  ))}

                                  {index === answers[q.id].length - 1 && (
                                    <button
                                      type="button"
                                      className="text-[#6BB1A0]"
                                      onClick={() => {
                                        const newRow: any = {};
                                        (extra?.fields || ["Nama", "Usia"]).forEach((f: string) => {
                                          newRow[f] = "";
                                        });
                                        setAnswer(q.id, [...answers[q.id], newRow]);
                                      }}
                                    >
                                      <Plus size={18} />
                                    </button>
                                  )}

                                  {index > 0 && (
                                    <button
                                      type="button"
                                      className="text-red-500"
                                      onClick={() => {
                                        const up = answers[q.id].filter((_: any, i: number) => i !== index);
                                        setAnswer(q.id, up);
                                      }}
                                    >
                                      <Trash size={18} />
                                    </button>
                                  )}
                                </div>
                              ))}

                            {(!Array.isArray(answers[q.id]) || answers[q.id].length === 0) && (
                              <button
                                type="button"
                                className="text-[#6BB1A0]"
                                onClick={() => {
                                  const row: any = {};
                                  (extra?.fields || ["Nama", "Usia"]).forEach((f: string) => { row[f] = "" });
                                  setAnswer(q.id, [row]);
                                }}
                              >
                                <Plus size={18} /> Tambah
                              </button>
                            )}
                          </div>
                        )}

                        {/* TABLE */}
                        {q.answer_type === "table" && (
                          <div className="mt-2 space-y-2">
                            {Array.isArray(extra?.rows) ? (
                              extra.rows.map((label: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-4">
                                  <span className="w-48">{label}</span>
                                  <input
                                    className="border p-2 rounded-md w-32"
                                    value={answers[q.id]?.[label] ?? ""}
                                    onChange={(e) => handleTableCell(q.id, label, e.target.value)}
                                  />
                                </div>
                              ))
                            ) : (
                              <p>Tidak ada baris.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-8 py-2 rounded-xl disabled:opacity-60"
                  >
                    {submitting ? "Mengirim..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}


