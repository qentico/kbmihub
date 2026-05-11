'use client'

import Link from 'next/link'
import { GitBranch, MessageCircle, Users, DollarSign, MessageSquare, CalendarDays, ShoppingBag, Megaphone, BarChart3 } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export default function FamilyPage() {
  const { tr, lang } = useLang()

  const sections = [
    {
      href: '/announcements',
      icon: Megaphone,
      labelEn: 'Bulletin',
      labelMs: 'Buletin',
      color: 'bg-orange-500',
    },
    {
      href: '/calendar',
      icon: CalendarDays,
      labelEn: 'Events',
      labelMs: 'Acara',
      color: 'bg-rose-500',
    },
    {
      href: '/marketplace',
      icon: ShoppingBag,
      labelEn: 'Marketplace',
      labelMs: 'Pasaran',
      color: 'bg-purple-500',
    },
    {
      href: '/polls',
      icon: BarChart3,
      labelEn: 'Polls',
      labelMs: 'Undian',
      color: 'bg-indigo-500',
    },
    {
      href: '/family/chats',
      icon: MessageCircle,
      labelEn: 'Social Media',
      labelMs: 'Media Sosial',
      color: 'bg-green-500',
    },
    {
      href: '/family/tree',
      icon: GitBranch,
      labelEn: 'Family Tree',
      labelMs: 'Pokok Keluarga',
      color: 'bg-emerald-500',
    },
    {
      href: '/family/exco',
      icon: Users,
      labelEn: 'Exco',
      labelMs: 'Exco',
      color: 'bg-teal-500',
    },
    {
      href: '/family/contributions',
      icon: DollarSign,
      labelEn: 'Contributions',
      labelMs: 'Sumbangan',
      color: 'bg-amber-500',
    },
    {
      href: '/family/feedback',
      icon: MessageSquare,
      labelEn: 'Feedback',
      labelMs: 'Maklum Balas',
      color: 'bg-blue-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="relative bg-[#2D1B5E] -mx-4 px-6 pt-6 pb-8 rounded-b-3xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kbmi.png"
          alt=""
          className="absolute right-0 top-0 h-36 w-auto object-cover object-top pointer-events-none"
        />
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white">{tr.family}</h2>
          <p className="text-sm text-violet-300 mt-1">{tr.appFull}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm border border-gray-100 space-y-2">
        <p className="text-base font-bold text-gray-900">
          {lang === 'en' ? 'Welcome to KBMI Hub! 🏡' : 'Selamat Datang ke KBMI Hub! 🏡'}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {lang === 'en' ? "We're so glad you're here." : 'Kami sangat gembira anda di sini.'}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {lang === 'en'
            ? "This is your family's very own digital home. Whether you're here to catch up on the latest news, join an upcoming event, or simply stay close to the people who matter most — you belong here."
            : 'Ini adalah rumah digital keluarga kita. Sama ada anda di sini untuk mengikuti berita terkini, menyertai acara akan datang, atau sekadar kekal dekat dengan orang yang tersayang — anda di tempat yang tepat.'}
        </p>
        <p className="text-sm font-semibold text-violet-700">
          {lang === 'en' ? "Welcome home. Let's grow together." : 'Selamat pulang. Mari kita membesar bersama.'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-4 gap-y-6">
        {sections.map(({ href, icon: Icon, labelEn, labelMs, color }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color} shadow-md group-active:scale-90 transition-transform`}>
              <Icon className="h-8 w-8 text-white" strokeWidth={1.8} />
            </div>
            <span className="text-center text-xs font-medium text-gray-700 leading-tight">
              {lang === 'en' ? labelEn : labelMs}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
