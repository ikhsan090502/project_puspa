'use client'
import { Suspense } from 'react'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Memuat Halaman Auth...</div>}>
      <div className="layout-main p-10">
        <h1 className="text-2xl font-bold mb-4 text-[#5B3C88]">Halaman Autentikasi</h1>
        <ul className="space-y-2">
          <li><Link href="/auth/login" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">🔐 Login</Link></li>
          <li><Link href="/auth/register" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">📝 Registrasi</Link></li>
          <li><Link href="/auth/lupa_password" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">🔑 Lupa Password</Link></li>
          <li><Link href="/auth/email-verify" className="text-[#5B3C88] hover:text-[#B8E8DB] transition-colors">✉️ Verifikasi Email</Link></li>
        </ul>
      </div>
    </Suspense>
  )
}