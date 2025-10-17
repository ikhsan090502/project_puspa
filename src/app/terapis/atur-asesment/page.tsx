"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface DatePickerProps {
  pasien: { id: number; nama: string };
  initialDate?: string;
  onClose: () => void;
  onSave: (date: Date) => void;
}

export default function DatePicker({
  pasien,
  initialDate,
  onClose,
  onSave,
}: DatePickerProps) {
  const [date, setDate] = useState<Date>(
    initialDate ? new Date(initialDate) : new Date()
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
        <h2 className="text-lg font-semibold mb-4">Pilih tanggal asesment</h2>

        <p className="text-sm mb-2">
          Nama Pasien: <b>{pasien.nama}</b>
        </p>

        <Calendar
          onChange={(val: any) => setDate(val)}
          value={date}
          locale="id-ID"
          className="rounded-md border border-gray-300 p-2"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSave(date);
              onClose();
            }}
            className="px-4 py-2 rounded bg-[#81B7A9] text-white hover:bg-[#5f9d8f]"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
