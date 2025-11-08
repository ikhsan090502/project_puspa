"use client";

import { Bell, User } from "lucide-react";

export default function HeaderOwner() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-[#36315B]">Dashboard Owner</h1>
        <p className="text-gray-600">Selamat datang di panel owner Puspa</p>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#81B7A9] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-[#36315B]">Owner</span>
        </div>
      </div>
    </header>
  );
}