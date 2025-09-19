

export interface Question {
  id: string;
  text: string;
  score: number;
}

export const questions: Record<string, Question[]> = {
  "Perilaku & Emosi": [
    { id: "pe1", text: "Hiperaktif atau bergerak tidak bertujuan", score: 3 },
    { id: "pe2", text: "Hiperaktif atau lamban bergerak", score: 3 },
    { id: "pe3", text: "Tidak mampu mengikuti aturan", score: 3 },
    { id: "pe4", text: "Menyakiti diri sendiri atau menyerang orang lain ketika marah", score: 3 },
    { id: "pe5", text: "Perilaku repetitif atau berulang-ulang", score: 3 },
    { id: "pe6", text: "Tidak dapat duduk tenang", score: 3 },
  ],
  "Fisik & Motorik": [
    { id: "fm1", text: "Kelainan pada anggota tubuh atau pemakaian alat bantu", score: 1 },
    { id: "fm2", text: "Tidak mampu melompat", score: 1 },
    { id: "fm3", text: "Tidak mampu mengikuti contoh gerakan seperti senam", score: 2 },
    { id: "fm4", text: "Tidak mampu menggunting", score: 2 },
    { id: "fm5", text: "Tidak mampu melipat kertas", score: 2 },
  ],
  "Bahasa & Bicara": [
    { id: "bb1", text: "Saat ditanya mengulang pertanyaan atau perkataan", score: 1 },
    { id: "bb2", text: "Tidak mampu memahami perintah / instruksi", score: 2 },
    { id: "bb3", text: "Tidak mampu berkomunikasi 2 arah / tanya jawab", score: 3 },
  ],
  "Kognitif & Akademik": [
    { id: "ka1", text: "Tidak mampu menyelesaikan tugas", score: 2 },
    { id: "ka2", text: "Tidak mampu mempertahankan atensi dan konsentrasi ketika diberi tugas", score: 2 },
    { id: "ka3", text: "Tidak mampu menyebutkan identitas diri dan anggota keluarga", score: 3 },
    { id: "ka4", text: "Tidak mampu menamai benda sekitar", score: 3 },
    { id: "ka5", text: "Tidak mampu mengurutkan angka 1-10", score: 1 },
    { id: "ka6", text: "Tidak mampu mengurutkan abjad A-Z", score: 1 },
  ],
  "Sosialisasi": [
    { id: "s1", text: "Kurang mampu bermain bersama teman sebaya", score: 2 },
    { id: "s2", text: "Tidak mampu bergiliran dalam permainan", score: 2 },
    { id: "s3", text: "Menghindari kontak mata dengan orang lain", score: 3 },
  ],
};
