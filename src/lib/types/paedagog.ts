// src/lib/types/paedagog.ts

export type QuestionItem = {
  field: string;
  label: string;
  options: number[];
  id: number;
  answer_type: string;
};

export type AspectItem = {
  key: string;
  title: string;
  questions: QuestionItem[];
};

export type QuestionsData = AspectItem[];

export type Answer = { desc?: string; score?: number };
export type AnswersState = Record<string, Record<number, Answer>>;
