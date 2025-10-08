"use client";
import Link from "next/link";
import { Home, ClipboardList, LogOut } from "lucide-react";

export default function SidebarOrangtua() {
  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-blue-600">PuspaCare</h2>
      <nav className="flex-1 space-y-2">
        <Link href="/orangtua/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100">
          <Home className="h-4 w-4" /> <span>Dashboard</span>
        </Link>
        <Link href="/orangtua/observasi" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100">
          <ClipboardList className="h-4 w-4" /> <span>Observasi</span>
        </Link>
      </nav>
      <button className="mt-auto flex items-center space-x-2 text-red-600 hover:underline">
        <LogOut className="h-4 w-4" /> <span>Keluar</span>
      </button>
    </aside>
  );
}
