"use client";

import { useState } from "react";

interface FormAssessmentOrangTuaProps {
  selectedChildrenIds: string[];
  onComplete: () => void;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: "radio" | "textarea";
  options?: string[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "1",
    question: "Apakah anak Anda sering mengalami kesulitan fokus dalam kegiatan sehari-hari?",
    type: "radio",
    options: ["Ya", "Tidak", "Kadang-kadang"]
  },
  {
    id: "2",
    question: "Bagaimana anak Anda berinteraksi dengan teman-temannya?",
    type: "radio",
    options: ["Sangat sosial", "Cukup sosial", "Kurang sosial", "Tidak suka berinteraksi"]
  },
  {
    id: "3",
    question: "Apakah anak Anda mudah frustrasi ketika menghadapi tugas yang sulit?",
    type: "radio",
    options: ["Ya, sangat mudah", "Kadang-kadang", "Tidak, cukup sabar"]
  },
  {
    id: "4",
    question: "Bagaimana pola tidur anak Anda?",
    type: "radio",
    options: ["Teratur", "Kadang tidak teratur", "Sangat tidak teratur"]
  },
  {
    id: "5",
    question: "Apakah anak Anda menunjukkan minat yang kuat terhadap aktivitas tertentu?",
    type: "radio",
    options: ["Ya", "Tidak", "Belum jelas"]
  },
  {
    id: "6",
    question: "Apakah anak Anda mengalami kesulitan dalam berkomunikasi atau berbicara?",
    type: "radio",
    options: ["Ya", "Tidak", "Kadang-kadang"]
  },
  {
    id: "7",
    question: "Bagaimana kemampuan motorik anak Anda (berjalan, berlari, koordinasi tangan)?",
    type: "radio",
    options: ["Baik", "Cukup", "Perlu bantuan", "Sangat kesulitan"]
  },
  {
    id: "8",
    question: "Apakah anak Anda peka terhadap suara, cahaya, atau sentuhan?",
    type: "radio",
    options: ["Ya, sangat peka", "Sedikit peka", "Normal", "Tidak peka"]
  },
  {
    id: "9",
    question: "Bagaimana kemampuan anak Anda dalam membaca dan menulis?",
    type: "radio",
    options: ["Baik sesuai umur", "Sedikit tertinggal", "Perlu bantuan", "Sangat kesulitan"]
  },
  {
    id: "10",
    question: "Apakah anak Anda mengalami kesulitan dalam belajar matematika?",
    type: "radio",
    options: ["Ya", "Tidak", "Kadang-kadang"]
  },
  {
    id: "11",
    question: "Bagaimana perilaku anak Anda di sekolah atau tempat umum?",
    type: "radio",
    options: ["Tenang dan terkendali", "Aktif", "Sulit dikendalikan", "Menarik diri"]
  },
  {
    id: "12",
    question: "Apakah anak Anda mudah marah atau tantrum?",
    type: "radio",
    options: ["Ya, sering", "Kadang-kadang", "Jarang", "Tidak pernah"]
  },
  {
    id: "13",
    question: "Bagaimana nafsu makan anak Anda?",
    type: "radio",
    options: ["Baik", "Cukup", "Buruk", "Sangat pemilih"]
  },
  {
    id: "14",
    question: "Apakah anak Anda mengalami kesulitan tidur?",
    type: "radio",
    options: ["Ya", "Tidak", "Kadang-kadang"]
  },
  {
    id: "15",
    question: "Ceritakan pengalaman atau kekhawatiran Anda sebagai orang tua terkait perkembangan anak:",
    type: "textarea"
  },
  {
    id: "16",
    question: "Apakah ada riwayat keluarga dengan kondisi kesehatan mental atau perkembangan?",
    type: "radio",
    options: ["Ya", "Tidak", "Tidak tahu"]
  },
  {
    id: "17",
    question: "Bagaimana respons anak Anda terhadap perubahan rutinitas?",
    type: "radio",
    options: ["Mudah menyesuaikan", "Butuh waktu", "Sangat kesulitan"]
  },
  {
    id: "18",
    question: "Apakah anak Anda mengalami kesulitan dalam membuat keputusan?",
    type: "radio",
    options: ["Ya", "Tidak", "Kadang-kadang"]
  },
  {
    id: "19",
    question: "Bagaimana kemampuan anak Anda dalam mengikuti instruksi?",
    type: "radio",
    options: ["Baik", "Cukup", "Kesulitan", "Tidak dapat mengikuti"]
  },
  {
    id: "20",
    question: "Apakah anak Anda menunjukkan perilaku repetitif atau stereotip?",
    type: "radio",
    options: ["Ya", "Tidak", "Kadang-kadang"]
  }
];

export default function FormAssessmentOrangTua({ selectedChildrenIds, onComplete }: FormAssessmentOrangTuaProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = assessmentQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert("Harap jawab semua pertanyaan sebelum mengirim.");
      return;
    }

    setSubmitting(true);

    try {
      // Mock API call - in real app, send to backend
      const payload = {
        childrenIds: selectedChildrenIds,
        answers,
        submittedAt: new Date().toISOString()
      };

      console.log("Submitting assessment:", payload);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("Assessment berhasil dikirim!");
      onComplete();
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Terjadi kesalahan saat mengirim assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Assessment Orang Tua
      </h2>

      <div className="space-y-6">
        {assessmentQuestions.map((question, index) => (
          <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {index + 1}. {question.question}
            </h3>

            {question.type === "radio" && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "textarea" && (
              <textarea
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jawaban Anda..."
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Mengirim..." : "Kirim Assessment"}
        </button>
      </div>
    </div>
  );
}