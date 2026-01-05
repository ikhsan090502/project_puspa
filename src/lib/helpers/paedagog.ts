// src/lib/helpers/paedagog.ts

export type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: { value: number | string };
  note: string | null;
};

export type GroupedAnswers = Record<string, AnswerItem[]>;

const ASPEK_RANGE = [
  { title: "Membaca", from: 69, to: 78 },
  { title: "Menulis", from: 79, to: 90 },
  { title: "Berhitung", from: 91, to: 97 },
  { title: "Kesiapan Belajar", from: 98, to: 104 },
  { title: "Pengetahuan Umum", from: 105, to: 112 },
];

const getAspekByQuestionId = (id: number) => {
  const found = ASPEK_RANGE.find(r => id >= r.from && id <= r.to);
  return found?.title ?? "Lainnya";
};

export const groupByAspek = (items: AnswerItem[]): GroupedAnswers => {
  const grouped: GroupedAnswers = {};

  items.forEach(item => {
    const aspek = getAspekByQuestionId(Number(item.question_id));
    if (!grouped[aspek]) grouped[aspek] = [];
    grouped[aspek].push(item);
  });

  return grouped;
};
