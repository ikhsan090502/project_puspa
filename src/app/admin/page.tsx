'use client'
import { Suspense } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Memuat Admin Dashboard...</div>}>
      <div className="layout-main p-10">
        <h1 className="text-2xl font-bold mb-4 text-[#5B3C88]">Dashboard Admin</h1>
        <ul className="space-y-2">
          <li><Link href="/admin/dashboard" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">📊 Lihat Dashboard</Link></li>
          <li><Link href="/admin/data_admin" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">👩‍💼 Data Admin</Link></li>
          <li><Link href="/admin/data_terapis" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">🧠 Data Terapis</Link></li>
          <li><Link href="/admin/jadwal" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">📅 Jadwal</Link></li>
        </ul>
      </div>
    </Suspense>
  )
}