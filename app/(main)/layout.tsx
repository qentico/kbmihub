'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { DataProvider } from '@/lib/data-context'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <DataProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <TopBar />
        <main
          className="flex-1 pt-[57px] pb-[65px]"
          style={{ background: 'linear-gradient(to bottom, #2D1B5E 57px, #f8fafc 57px)' }}
        >
          <div className="mx-auto max-w-lg px-4 pb-4">{children}</div>
        </main>
        <BottomNav />
      </div>
    </DataProvider>
  )
}
