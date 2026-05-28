'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Root() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      router.replace(user ? '/announcements' : '/login')
    }
  }, [user, isLoading, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-emerald-700">KBMI</div>
        <div className="mt-2 text-sm text-muted-foreground">Loading...</div>
      </div>
    </div>
  )
}
