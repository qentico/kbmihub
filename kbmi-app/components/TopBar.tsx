'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Bell, Megaphone, CalendarDays, DollarSign, X, CheckCheck, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useLang } from '@/lib/language-context'
import { useData } from '@/lib/data-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TopBarProps {
  title?: string
}

export default function TopBar({ title }: TopBarProps) {
  const { user, logout } = useAuth()
  const { lang, setLang, tr } = useLang()
  const { notifications, markNotificationRead, markAllRead, users } = useData()
  const router = useRouter()
  const [showNotifs, setShowNotifs] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const myUser = users.find((u) => u.id === user?.id)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  // Filter: hofOnly notifications are only visible to HoF members or admins
  const visibleNotifs = notifications.filter(
    (n) =>
      (!n.hofOnly || myUser?.isHeadOfFamily || isAdmin) &&
      (!n.targetUserId || n.targetUserId === user?.id)
  )
  const unreadCount = visibleNotifs.filter((n) => !n.readBy.includes(user?.id || '')).length

  const notifIcon = (type: string) => {
    if (type === 'announcement') return <Megaphone className="h-4 w-4 text-emerald-600" />
    if (type === 'event')        return <CalendarDays className="h-4 w-4 text-blue-500" />
    if (type === 'listing')      return <ShoppingBag className="h-4 w-4 text-purple-500" />
    return <DollarSign className="h-4 w-4 text-amber-500" />
  }

  const notifTypeBg = (type: string) => {
    if (type === 'announcement') return 'bg-emerald-50'
    if (type === 'event')        return 'bg-blue-50'
    return 'bg-amber-50'
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2D1B5E]">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          {/* Brand */}
          <div>
            <span className="text-lg font-black text-white tracking-tight">{title || tr.appName}</span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-5">
            {/* Notification bell */}
            {user && (
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative text-white/70 hover:text-white transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Avatar — navigates to account page */}
            {user && (
              <Link href="/account">
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-white/30 overflow-hidden">
                  {user.profilePhoto
                    ? <img src={user.profilePhoto} alt="" className="h-full w-full object-cover" />
                    : <AvatarFallback className="bg-violet-700 text-xs font-bold text-white">{user.avatar}</AvatarFallback>
                  }
                </Avatar>
              </Link>
            )}

            {/* Lang toggle */}
            <div className="flex rounded-full border border-white/20 overflow-hidden text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 font-medium transition-colors ${lang === 'en' ? 'bg-white text-indigo-900' : 'text-white/60 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ms')}
                className={`px-2 py-1 font-medium transition-colors ${lang === 'ms' ? 'bg-white text-indigo-900' : 'text-white/60 hover:text-white'}`}
              >
                BM
              </button>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="text-white/60 hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification panel */}
      {showNotifs && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setShowNotifs(false)}
          />
          {/* Panel */}
          <div className="fixed top-14 left-0 right-0 z-50 mx-auto max-w-lg px-3">
            <div className="rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-700" />
                  <span className="text-sm font-semibold text-gray-900">
                    {lang === 'en' ? 'Notifications' : 'Pemberitahuan'}
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                      {unreadCount} {lang === 'en' ? 'new' : 'baru'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => { markAllRead(user?.id || ''); }}
                      className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      {lang === 'en' ? 'Mark all read' : 'Tandai semua dibaca'}
                    </button>
                  )}
                  <button onClick={() => setShowNotifs(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {visibleNotifs.length === 0 && (
                  <div className="py-8 text-center text-sm text-gray-400">
                    {lang === 'en' ? 'No notifications yet.' : 'Tiada pemberitahuan lagi.'}
                  </div>
                )}
                {visibleNotifs.map((n) => {
                  const isRead = n.readBy.includes(user?.id || '')
                  return (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id, user?.id || '')}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${isRead ? 'opacity-60' : ''}`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notifTypeBg(n.type)}`}>
                        {notifIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-sm text-gray-900 line-clamp-1 ${!isRead ? 'font-semibold' : 'font-normal'}`}>
                            {n.title}
                          </span>
                          {!isRead && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{n.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-400">{n.createdAt}</span>
                          {n.hofOnly && (
                            <span className="text-[10px] rounded-full bg-amber-100 text-amber-600 px-1.5 py-0.5">
                              {lang === 'en' ? 'HoF' : 'KK'}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
