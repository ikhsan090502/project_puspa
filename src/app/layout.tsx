import './globals.css'
import { Suspense } from 'react'
import Providers from './providers'

export const metadata = {
  title: 'Puspa Holistic Integrative Care',
  description: 'Sistem Observasi & Asesmen Terapi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#B8E8DB] font-[Playpen_Sans]">
        <Providers>
          <Suspense fallback={<div className="flex h-screen items-center justify-center text-lg">Memuat halaman...</div>}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}

