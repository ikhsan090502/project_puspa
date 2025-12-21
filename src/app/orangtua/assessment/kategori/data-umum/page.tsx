"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";
import { ChevronDown, Plus, Trash } from "lucide-react";
import { Menu, X } from "lucide-react";

import {
  getParentAssessmentQuestions,
  submitParentAssessment,
  updateParentIdentity,
} from "@/lib/api/asesmentTerapiOrtu";

import { getMyAssessments } from "@/lib/api/childrenAsesment";

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
  if (t === "table") return {}; // keep as object mapping rowLabel -> value
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [childName, setChildName] = useState<string>("");
  const [childBirthInfo, setChildBirthInfo] = useState<string>("");

  const [parentIdentity, setParentIdentity] = useState<any>({
    father_identity_number: null,
    father_name: null,
    father_phone: null,
    father_birth_date: null,
    father_occupation: null,
    father_relationship: null,

    mother_identity_number: null,
    mother_name: null,
    mother_phone: null,
    mother_birth_date: null,
    mother_occupation: null,
    mother_relationship: null,

    guardian_identity_number: null,
    guardian_name: null,
    guardian_phone: null,
    guardian_birth_date: null,
    guardian_occupation: null,
    guardian_relationship: null,

    address: null, // additional local field (not required by API but kept)
  });

  const activeStep = steps.findIndex((step) => pathname?.includes(step.path));

  /* =======================
     LOAD IDENTITAS ANAK (FROM ASSESSMENTS)
  ========================== */
  useEffect(() => {
    if (!assessmentIdFromQuery) return;

    const loadAssessments = async () => {
      try {
        const res = await getMyAssessments();
        const list = Array.isArray(res?.data) ? res.data : [];

        const found = list.find(
          (it: any) =>
            String(it.assessment_id) === String(assessmentIdFromQuery)
        );

        if (found) {
          setChildName(found.child_name || "");
          setChildBirthInfo(found.child_birth_info || "");
        }
      } catch (err) {
        console.error("Gagal memuat daftar assessment:", err);
      }
    };

    loadAssessments();
  }, [assessmentIdFromQuery]);

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

        const hasIdentitas = list.some((g: any) => g.group_key === "identitas");
        if (!hasIdentitas) {
          list.unshift({
            group_key: "identitas",
            title: "Identitas Anak & Orangtua",
            questions: []
          });
        }

        if (!mounted) return;
        setGroups(list);

        if (list.length > 0) setActiveCategory((prev) => prev || list[0].group_key);

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
     DERIVED QUESTIONS
  ========================== */
  const currentQuestions =
    groups.find((g) => g.group_key === activeCategory)?.questions || [];

  /* =======================
     NAVIGATION
  ========================== */
  const categoryOrder = groups.map((g) => g.group_key);
  const currentIndex = categoryOrder.indexOf(activeCategory);

  const goNextCategory = () => {
    if (currentIndex < categoryOrder.length - 1) {
      setActiveCategory(categoryOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrevCategory = () => {
    if (currentIndex > 0) {
      setActiveCategory(categoryOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* =======================
     UPDATE ANSWERS
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
          : [...arr, val],
      };
    });
  };

  // Updated: store table answers as object mapping label -> value
  const handleTableCell = (qid: any, label: string, value: any) => {
    setAnswers(prev => {
      const prevTable = (prev[qid] && typeof prev[qid] === "object") ? prev[qid] : {};
      return { ...prev, [qid]: { ...prevTable, [label]: value } };
    });
  };

  /* =======================
     HANDLE PARENT IDENTITY INPUTS
  ========================== */
  const setParentField = (key: string, value: any) => {
    setParentIdentity((prev: any) => ({ ...prev, [key]: value }));
  };

  /* =======================
     SUBMIT IDENTITAS (updateParentIdentity)
  ========================== */
  const handleSubmitIdentity = async (e?: any) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    try {
      // Build payload matching ParentIdentityPayload (null when empty)
      const payload = {
        father_identity_number: parentIdentity.father_identity_number || null,
        father_name: parentIdentity.father_name || null,
        father_phone: parentIdentity.father_phone || null,
        father_birth_date: parentIdentity.father_birth_date || null,
        father_occupation: parentIdentity.father_occupation || null,
        father_relationship: parentIdentity.father_relationship || null,

        mother_identity_number: parentIdentity.mother_identity_number || null,
        mother_name: parentIdentity.mother_name || null,
        mother_phone: parentIdentity.mother_phone || null,
        mother_birth_date: parentIdentity.mother_birth_date || null,
        mother_occupation: parentIdentity.mother_occupation || null,
        mother_relationship: parentIdentity.mother_relationship || null,

        guardian_identity_number: parentIdentity.guardian_identity_number || null,
        guardian_name: parentIdentity.guardian_name || null,
        guardian_phone: parentIdentity.guardian_phone || null,
        guardian_birth_date: parentIdentity.guardian_birth_date || null,
        guardian_occupation: parentIdentity.guardian_occupation || null,
        guardian_relationship: parentIdentity.guardian_relationship || null,
      };

      await updateParentIdentity(payload);

      alert("Identitas berhasil disimpan.");
      router.push("/orangtua/assessment");
    } catch (err: any) {
      console.error("Gagal update identitas:", err);
      alert(err?.message || "Gagal menyimpan identitas");
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================
     SUBMIT ASSESSMENT (submitParentAssessment)
  ========================== */
  /* =======================
   SUBMIT ASSESSMENT (revisi sesuai BE)
========================== */
  const handleSubmitAssessment = async () => {
    if (!assessmentIdFromQuery) {
      alert("assessment_id tidak ditemukan di URL.");
      return;
    }

    setSubmitting(true);
    try {
      // convert answers {} -> answers[] untuk BE
      const answerArray = Object.entries(answers).map(([qid, value]) => {
        let ansPayload: any = {};

        if (value === null || value === undefined || value === "") {
          ansPayload = { value: null };
        } else if (typeof value === "object") {
          // Jika sudah object (radio_with_text, table, multi)
          ansPayload = value;
        } else if (Array.isArray(value)) {
          // checkbox/multi diubah jadi object dengan array value
          ansPayload = { value };
        } else {
          // text/number/select => bungkus jadi object
          ansPayload = { value };
        }

        return {
          question_id: Number(qid),
          answer: ansPayload,
        };
      });

      const payload = {
        answers: answerArray,
        child_name: childName || null,
        child_birth_info: childBirthInfo || null,
      };

      await submitParentAssessment(
        assessmentIdFromQuery,
        "umum_parent",
        payload
      );

      alert("Jawaban assessment berhasil dikirim.");
      router.push("/orangtua/assessment");
    } catch (err: any) {
      console.error("Gagal submit assessment:", err);
      alert(err?.message || "Gagal mengirim jawaban assessment");
    } finally {
      setSubmitting(false);
    }
  };


  /* =======================
     RENDER
  ========================== */
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-20
        w-64 bg-white shadow-md
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <SidebarOrangtua />
      </aside>

      {/* overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* hamburger (mobile only) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-md shadow"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* ================= CONTENT ================= */}
<div className="flex-1 flex flex-col">
        <HeaderOrangtua />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* CLOSE BUTTON */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/orangtua/assessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

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
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${i === activeStep
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

          {/* CONTENT */}
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

            {/* IDENTITAS PAGE */}
            {activeCategory === "identitas" && (
              <form onSubmit={handleSubmitIdentity} className="space-y-10 mb-10">

                {/* ANAK */}
                <div>
                  <h3 className="font-semibold text-[#36315B] text-base mb-4">1. Anak</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
                    <div className="flex flex-col">
                      <label className="font-medium mb-1">Nama</label>
                      <input
                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-medium mb-1">Tanggal Lahir</label>
                      <input
                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50"
                        value={childBirthInfo}
                        onChange={(e) => setChildBirthInfo(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col col-span-2">
                      <label className="font-medium mb-1">Alamat</label>
                      <input
                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50"
                        placeholder="Jln. Malabar Selatan 10"
                        value={parentIdentity.address || ""}
                        onChange={(e) => setParentField("address", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* ORANG TUA */}
                <div>
                  <h3 className="font-semibold text-[#36315B] text-base mb-6">2. Orangtua</h3>

                  {/* AYAH */}
                  <h4 className="font-semibold text-[#36315B] text-sm mb-3">Ayah</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm mb-8">
                    <InputField label="Nama Ayah" value={parentIdentity.father_name || ""} onChange={(v) => setParentField("father_name", v)} />
                    <InputField label="Tanggal Lahir" value={parentIdentity.father_birth_date || ""} onChange={(v) => setParentField("father_birth_date", v)} />
                    <InputField label="Pekerjaan" value={parentIdentity.father_occupation || ""} onChange={(v) => setParentField("father_occupation", v)} />
                    <InputField label="Nomor Telpon" value={parentIdentity.father_phone || ""} onChange={(v) => setParentField("father_phone", v)} />
                    <InputField label="Hubungan dengan anak" value={parentIdentity.father_relationship || ""} onChange={(v) => setParentField("father_relationship", v)} />
                    <InputField label="NIK" value={parentIdentity.father_identity_number || ""} onChange={(v) => setParentField("father_identity_number", v)} />
                  </div>

                  {/* IBU */}
                  <h4 className="font-semibold text-[#36315B] text-sm mb-3">Ibu</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm mb-8">
                    <InputField label="Nama Ibu" value={parentIdentity.mother_name || ""} onChange={(v) => setParentField("mother_name", v)} />
                    <InputField label="Tanggal Lahir" value={parentIdentity.mother_birth_date || ""} onChange={(v) => setParentField("mother_birth_date", v)} />
                    <InputField label="Pekerjaan" value={parentIdentity.mother_occupation || ""} onChange={(v) => setParentField("mother_occupation", v)} />
                    <InputField label="Nomor Telpon" value={parentIdentity.mother_phone || ""} onChange={(v) => setParentField("mother_phone", v)} />
                    <InputField label="Hubungan dengan anak" value={parentIdentity.mother_relationship || ""} onChange={(v) => setParentField("mother_relationship", v)} />
                    <InputField label="NIK" value={parentIdentity.mother_identity_number || ""} onChange={(v) => setParentField("mother_identity_number", v)} />
                  </div>

                  {/* WALI */}
                  <h4 className="font-semibold text-[#36315B] text-sm mb-3">Wali</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm mb-8">
                    <InputField label="Nama Wali" value={parentIdentity.guardian_name || ""} onChange={(v) => setParentField("guardian_name", v)} />
                    <InputField label="Tanggal Lahir" value={parentIdentity.guardian_birth_date || ""} onChange={(v) => setParentField("guardian_birth_date", v)} />
                    <InputField label="Pekerjaan" value={parentIdentity.guardian_occupation || ""} onChange={(v) => setParentField("guardian_occupation", v)} />
                    <InputField label="Nomor Telpon" value={parentIdentity.guardian_phone || ""} onChange={(v) => setParentField("guardian_phone", v)} />
                    <InputField label="Hubungan dengan Anak" value={parentIdentity.guardian_relationship || ""} onChange={(v) => setParentField("guardian_relationship", v)} />
                    <InputField label="NIK" value={parentIdentity.guardian_identity_number || ""} onChange={(v) => setParentField("guardian_identity_number", v)} />
                    <div className="flex flex-col col-span-2">
                      <label className="mb-1">Alamat</label>
                      <input className="border p-2 rounded-md" name="alamat_wali" value={parentIdentity.address || ""} onChange={(e) => setParentField("address", e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-stretch md:items-center gap-3 pt-6">
                  <div />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => router.push("/orangtua/assessment")}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-8 py-2 rounded-xl disabled:opacity-60"
                    >
                      {submitting ? "Mengirim..." : "Simpan Identitas"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* DYNAMIC QUESTIONS */}
            {activeCategory !== "identitas" && (
              <div className="space-y-6">
                {loading ? (
                  <p>Memuat pertanyaan...</p>
                ) : currentQuestions.length === 0 ? (
                  <p>Tidak ada pertanyaan di kategori ini.</p>
                ) : (
                  currentQuestions.map((q: any) => {
                    const extra = safeJsonParse(q.extra_schema, {});
                    const optionsRaw = Array.isArray(extra?.options)
                      ? extra.options
                      : safeJsonParse(q.answer_options, []);
                    // normalize options to string values
                    const options = (optionsRaw || []).map((opt: any) =>
                      typeof opt === "string" ? opt : opt?.value ?? opt?.label ?? String(opt)
                    );

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
                            className="border rounded-md p-2 w-full sm:w-32"
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

                        {/* MULTI */}
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
                                    value={(answers[q.id] && answers[q.id][label]) ?? ""}
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

                {/* BUTTON NAVIGATION */}
                <div className="flex justify-between pt-6">

                  {currentIndex > 0 ? (
                    <button
                      type="button"
                      onClick={goPrevCategory}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
                    >
                      Sebelumnya
                    </button>
                  ) : <div />}

                  {currentIndex < categoryOrder.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNextCategory}
                      className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-8 py-2 rounded-xl"
                    >
                      Selanjutnya
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitAssessment}
                      disabled={submitting}
                      className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-8 py-2 rounded-xl disabled:opacity-60"
                    >
                      {submitting ? "Mengirim..." : "Simpan"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

/* =======================
   SMALL INPUT COMPONENT
========================== */
function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}</label>
      <input
        className="border p-2 rounded-md"
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
