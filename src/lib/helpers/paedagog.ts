// src/lib/helpers/paedagog.ts
import { AnswersState, QuestionsData } from "../types/paedagog";

export const mapAnswersToPayloadBE = (
  answersState: AnswersState,
  questionsData: QuestionsData
) => {
  const answersPayload: any[] = [];

  for (const aspek of questionsData) {
    const akey = aspek.key;
    const aspekAnswers = answersState[akey] || {};

    Object.entries(aspekAnswers).forEach(([idx, val]) => {
      const q = aspek.questions[Number(idx)];
      if (!q) return;

      const payloadItem: any = {
        question_id: q.id,
      };

      // ✨ Cast val agar TypeScript tahu tipenya
      const answerVal = val as { desc?: string; score?: number };

      if (q.answer_type === "text") {
        payloadItem.answer = { value: answerVal.desc || "" };
      } else if (answerVal.score !== undefined) {
        payloadItem.answer = { value: answerVal.score };
        if (answerVal.desc) payloadItem.note = answerVal.desc;
      }

      answersPayload.push(payloadItem);
    });
  }

  return { answers: answersPayload };
};
