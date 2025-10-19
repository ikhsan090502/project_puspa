'use client'
import { Suspense } from 'react'
import Link from 'next/link'

export default function OrangtuaPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Memuat Dashboard Orang Tua...</div>}>
      <div className="layout-main p-10">
        <h1 className="text-2xl font-bold mb-4 text-[#5B3C88]">Dashboard Orang Tua</h1>
        <ul className="space-y-2">
          <li><Link href="/orangtua/dashboard" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">🏠 Dashboard Utama</Link></li>
          <li><Link href="/pendaftaran" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">📝 Pendaftaran Anak</Link></li>
        </ul>
      </div>
    </Suspense>
  )
}