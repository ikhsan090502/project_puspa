"use client";

import { CalendarDays, Users } from "lucide-react";

export default function CardInfo() {
  return (
    <div className="grid grid-cols-3 gap-4 my-4 text-[#36315B]">
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <CalendarDays className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Sesi Terapi Hari Ini</p>
          <h3 className="text-lg font-bold">4</h3>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <CalendarDays className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Sesi Observasi Hari Ini</p>
          <h3 className="text-lg font-bold">1</h3>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <Users className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Total Pasien Aktif</p>
          <h3 className="text-lg font-bold">50</h3>
        </div>
      </div>
    </div>
  );
}
