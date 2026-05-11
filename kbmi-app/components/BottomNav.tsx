'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Megaphone, Users, CalendarDays, ShoppingBag } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'

export default function BottomNav() {
  const pathname = usePathname()
  const { tr } = useLang()
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const navItems = [
    { href: '/family', icon: Home, label: tr.family },
    { href: '/announcements', icon: Megaphone, label: tr.announcements },
    { href: '/calendar', icon: CalendarDays, label: tr.calendar },
    { href: '/marketplace', icon: ShoppingBag, label: tr.marketplace },
    ...(isAdmin ? [{ href: '/admin', icon: Users, label: tr.admin }] : []),
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors ${
                active ? 'text-violet-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`rounded-xl p-1.5 transition-colors ${active ? 'bg-violet-100' : ''}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className="leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
