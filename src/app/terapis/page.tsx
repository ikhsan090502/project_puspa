'use client'
import { Suspense } from 'react'
import Link from 'next/link'

export default function TerapisPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Memuat Dashboard Terapis...</div>}>
      <div className="layout-main p-10">
        <h1 className="text-2xl font-bold mb-4 text-[#5B3C88]">Dashboard Terapis</h1>
        <ul className="space-y-2">
          <li><Link href="/terapis/dashboard" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">🏠 Dashboard Utama</Link></li>
          <li><Link href="/terapis/observasi" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">📋 Observasi Pasien</Link></li>
          <li><Link href="/terapis/atur-asesment" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">⚙️ Atur Asesmen</Link></li>
          <li><Link href="/terapis/hasil-observasi" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">📊 Hasil Observasi</Link></li>
          <li><Link href="/terapis/riwayat-hasil" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">📚 Riwayat Hasil</Link></li>
        </ul>
      </div>
    </Suspense>
  )
}