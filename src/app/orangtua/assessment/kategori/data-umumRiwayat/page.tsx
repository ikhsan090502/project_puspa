"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { ChevronDown } from "lucide-react";

import {
  getParentAssessmentAnswers,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";
import {
  getMyAssessments,
  getChildDetail,
} from "@/lib/api/childrenAsesment";

const parentGeneralRanges = [
  { group_key: "riwayat_psikososial", title: "Riwayat Psikososial", range: [430, 434] },
  { group_key: "riwayat_kehamilan", title: "Riwayat Kehamilan", range: [435, 442] },
  { group_key: "riwayat_kelahiran", title: "Riwayat Kelahiran", range: [443, 455] },
  { group_key: "riwayat_setelah_kelahiran", title: "Riwayat Setelah Kelahiran", range: [456, 468] },
  { group_key: "riwayat_kesehatan", title: "Riwayat Kesehatan", range: [469, 476] },
  { group_key: "riwayat_pendidikan", title: "Riwayat Pendidikan", range: [477, 485] },
];

export default function RiwayatJawabanOrangtua() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");
  const type = (searchParams.get("type") || "umum_parent") as ParentSubmitType;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = useState<string>(
    parentGeneralRanges[0].group_key
  );
  const [childInfo, setChildInfo] = useState<any>({});
  const [familyInfo, setFamilyInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [aRes, myAssessments] = await Promise.all([
          getParentAssessmentAnswers(assessmentId, type),
          getMyAssessments(),
        ]);

        const answerMap: Record<string, any> = {};
        (aRes?.data || []).forEach((item: any) => {
          answerMap[item.question_id] = {
            value: item.answer?.value ?? item.answer ?? null,
            note: item.note ?? null,
            question_text: item.question_text,
            question_number: item.question_number,
          };
        });
        setAnswers(answerMap);

        const found = (myAssessments?.data || []).find(
          (x: any) => String(x.assessment_id) === String(assessmentId)
        );
        setChildInfo(found || {});

        if (found?.child_id) {
          const detail = await getChildDetail(found.child_id);
          setFamilyInfo(detail);
        }
      } catch (err) {
        console.error("❌ Gagal memuat data riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, type]);

  const currentQuestions = Object.entries(answers)
    .filter(([id]) => {
      const numId = parseInt(id);
      const rangeObj = parentGeneralRanges.find(
        (g) => g.group_key === activeCategory
      );
      return rangeObj
        ? numId >= rangeObj.range[0] && numId <= rangeObj.range[1]
        : true;
    })
    .map(([id, val]) => ({ question_id: id, ...val }));

  /* ================= NAVIGASI KATEGORI ================= */
  const categoryOrder = parentGeneralRanges.map((g) => g.group_key);
  const currentIndex = categoryOrder.indexOf(activeCategory);

  const goPrevCategory = () => {
    if (currentIndex > 0) {
      setActiveCategory(categoryOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNextCategory = () => {
    if (currentIndex < categoryOrder.length - 1) {
      setActiveCategory(categoryOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  /* ===================================================== */

  const renderCellValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      const allNull = Object.values(value).every((v) => !v);
      return allNull ? "-" : JSON.stringify(value);
    }
    return value ?? "-";
  };

  const renderAnswer = (answer: any) => {
    if (!answer) return <span>-</span>;
    if (typeof answer === "string" || typeof answer === "number")
      return <span>{answer}</span>;

    if (Array.isArray(answer)) {
      if (!answer.length) return <span>-</span>;
      if (typeof answer[0] === "object") {
        const headers = Object.keys(answer[0]);
        return (
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-300 w-full text-sm min-w-[500px]">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="border border-gray-300 px-2 py-1 font-semibold bg-gray-100 text-left"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {answer.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((h) => (
                      <td
                        key={h}
                        className="border border-gray-300 px-2 py-1"
                      >
                        {renderCellValue(row[h])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return (
        <ul className="list-disc pl-5 space-y-1">
          {answer.map((v, i) => (
            <li key={i}>{v ?? "-"}</li>
          ))}
        </ul>
      );
    }

    if (typeof answer === "object") {
      const allNull = Object.values(answer).every((v) => !v);
      if (allNull) return <span>-</span>;
      return (
        <div className="overflow-x-auto">
          <table className="border-collapse border border-gray-300 w-full text-sm min-w-[300px]">
            <tbody>
              {Object.entries(answer).map(([k, v]) => (
                <tr key={k}>
                  <td className="border border-gray-300 px-2 py-1 font-semibold min-w-[150px]">
                    {k}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {renderCellValue(v)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <span>{String(answer)}</span>;
  };

  return (
    <ResponsiveOrangtuaLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#36315B]">
          Riwayat Jawaban Orangtua
        </h2>
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
        >
          ✕
        </button>
      </div>

      {/* IDENTITAS ANAK & ORANGTUA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
        <h3 className="font-semibold text-[#36315B] mb-4">
          Identitas Anak & Orangtua
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><p className="font-semibold">Nama Anak</p><p>{familyInfo.child_name || "-"}</p></div>
          <div><p className="font-semibold">Tempat, Tanggal Lahir</p><p>{familyInfo.child_birth_info || "-"}</p></div>
          <div><p className="font-semibold">Usia</p><p>{familyInfo.child_age || "-"}</p></div>
          <div><p className="font-semibold">Jenis Kelamin</p><p>{familyInfo.child_gender || "-"}</p></div>
          <div><p className="font-semibold">Agama</p><p>{familyInfo.child_religion || "-"}</p></div>
          <div><p className="font-semibold">Sekolah</p><p>{familyInfo.child_school || "-"}</p></div>
          <div className="col-span-1 md:col-span-2">
            <p className="font-semibold">Alamat</p>
            <p>{familyInfo.child_address || "-"}</p>
          </div>

          <div className="col-span-1 md:col-span-2 mt-4 font-semibold border-t pt-2">
            Data Ayah
          </div>
          <div><p className="font-semibold">Nama Ayah</p><p>{familyInfo.father_name || "-"}</p></div>
          <div>
  <p className="font-semibold">Tanggal Lahir</p>
  <p>{familyInfo.father_birth_date || "-"}</p>
</div>

          <div><p className="font-semibold">No. Telepon</p><p>{familyInfo.father_phone || "-"}</p></div>
          <div><p className="font-semibold">NIK</p><p>{familyInfo.father_identity_number || "-"}</p></div>
          <div><p className="font-semibold">Pekerjaan</p><p>{familyInfo.father_occupation || "-"}</p></div>
          <div><p className="font-semibold">Hubungan dengan Anak</p><p>{familyInfo.father_relationship || "-"}</p></div>

          <div className="col-span-1 md:col-span-2 mt-4 font-semibold border-t pt-2">
            Data Ibu
          </div>
          <div><p className="font-semibold">Nama Ibu</p><p>{familyInfo.mother_name || "-"}</p></div>
          <div>
  <p className="font-semibold">Tanggal Lahir</p>
  <p>{familyInfo.mother_birth_date || "-"}</p>
</div>

          <div><p className="font-semibold">No. Telepon</p><p>{familyInfo.mother_phone || "-"}</p></div>
          <div><p className="font-semibold">NIK</p><p>{familyInfo.mother_identity_number || "-"}</p></div>
          <div><p className="font-semibold">Pekerjaan</p><p>{familyInfo.mother_occupation || "-"}</p></div>
          <div><p className="font-semibold">Hubungan dengan Anak</p><p>{familyInfo.mother_relationship || "-"}</p></div>

          <div className="col-span-1 md:col-span-2 mt-4 font-semibold border-t pt-2">
            Data Wali
          </div>
          <div><p className="font-semibold">Nama Wali</p><p>{familyInfo.guardian_name || "-"}</p></div>
         <div>
  <p className="font-semibold">Tanggal Lahir</p>
  <p>{familyInfo.guardian_birth_date || "-"}</p>
</div>

          <div><p className="font-semibold">No. Telepon</p><p>{familyInfo.guardian_phone || "-"}</p></div>
          <div><p className="font-semibold">NIK</p><p>{familyInfo.guardian_identity_number || "-"}</p></div>
          <div><p className="font-semibold">Pekerjaan</p><p>{familyInfo.guardian_occupation || "-"}</p></div>
          <div><p className="font-semibold">Hubungan dengan Anak</p><p>{familyInfo.guardian_relationship || "-"}</p></div>
        </div>
      </div>

      {/* PILIH KATEGORI */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Kategori Pertanyaan</h3>
        <div className="relative inline-block">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm"
          >
            {parentGeneralRanges.map((g) => (
              <option key={g.group_key} value={g.group_key}>
                {g.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4" />
        </div>
      </div>

      {/* DAFTAR PERTANYAAN */}
      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-8 text-[#36315B]">
        {loading ? (
          <p>Memuat data...</p>
        ) : currentQuestions.length === 0 ? (
          <p>Tidak ada pertanyaan.</p>
        ) : (
          currentQuestions.map((q) => (
            <div key={q.question_id} className="mb-5">
              <label className="block font-medium mb-1">
                {q.question_number ? `${q.question_number}. ` : ""}
                {q.question_text}
              </label>
              <div className="text-sm bg-gray-50 border rounded-md px-3 py-2 font-medium">
                {renderAnswer(q.value)}
              </div>
              {q.note && (
                <p className="text-sm mt-1 italic">
                  Keterangan: {q.note}
                </p>
              )}
            </div>
          ))
        )}
      </section>

      {/* NAVIGASI KATEGORI */}
      <div className="flex justify-between mt-6">
        {currentIndex > 0 ? (
          <button
            onClick={goPrevCategory}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
          >
            Sebelumnya
          </button>
        ) : (
          <div />
        )}

        {currentIndex < categoryOrder.length - 1 ? (
          <button
            onClick={goNextCategory}
            className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-6 py-2 rounded-xl"
          >
            Selanjutnya
          </button>
        ) : (
          <div />
        )}
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
