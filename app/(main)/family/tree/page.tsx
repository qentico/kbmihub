'use client'

import Link from 'next/link'
import { ArrowLeft, GitBranch } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export default function FamilyTreePage() {
  const { tr, lang } = useLang()

  return (
    <div className="space-y-4">
      <div className="relative bg-[#2D1B5E] -mx-4 px-6 pt-6 pb-8 rounded-b-3xl overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/family" className="text-white/70 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-white">{tr.familyTree}</h2>
            <p className="text-sm text-violet-300 mt-0.5">
              {lang === 'en' ? 'Interactive family chart' : 'Carta keluarga interaktif'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <GitBranch className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {lang === 'en' ? 'Family Tree Coming Soon' : 'Pokok Keluarga Akan Datang'}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          {lang === 'en'
            ? 'The interactive family tree diagram will be built once the full family structure chart is provided. Stay tuned!'
            : 'Rajah pokok keluarga interaktif akan dibina apabila carta struktur keluarga penuh disediakan. Nantikan!'}
        </p>
      </div>
    </div>
  )
}
