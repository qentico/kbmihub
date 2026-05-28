'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const { lang } = useLang()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError(lang === 'en' ? 'Passwords do not match.' : 'Kata laluan tidak sepadan.')
      return
    }
    if (password.length < 6) {
      setError(
        lang === 'en'
          ? 'Password must be at least 6 characters.'
          : 'Kata laluan mestilah sekurang-kurangnya 6 aksara.'
      )
      return
    }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#2D1B5E] flex flex-col items-center pt-10 px-6">
      <div className="w-full max-w-xs">
        <div className="mb-6 mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/20">
            <span className="text-lg font-black text-white">K</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">KBMI Hub</h1>
        </div>

        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-1">
            {lang === 'en' ? 'Set New Password' : 'Tetapkan Kata Laluan Baru'}
          </h2>

          {done ? (
            <div className="mt-4 rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-4 text-sm text-emerald-300 text-center leading-relaxed">
              {lang === 'en'
                ? '✓ Password updated! Redirecting to login…'
                : '✓ Kata laluan dikemas kini! Mengalih ke log masuk…'}
            </div>
          ) : !ready ? (
            <p className="mt-4 text-sm text-violet-300">
              {lang === 'en' ? 'Verifying reset link…' : 'Mengesahkan pautan…'}
            </p>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 mt-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-violet-300 uppercase tracking-wide">
                  {lang === 'en' ? 'New Password' : 'Kata Laluan Baru'}
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-violet-300 uppercase tracking-wide">
                  {lang === 'en' ? 'Confirm Password' : 'Sahkan Kata Laluan'}
                </label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-white text-indigo-900 font-bold hover:bg-violet-100 mt-1"
              >
                {loading
                  ? (lang === 'en' ? 'Saving…' : 'Menyimpan…')
                  : (lang === 'en' ? 'Update Password' : 'Kemas Kini Kata Laluan')}
              </Button>
            </form>
          )}

          <div className="mt-5 text-center text-sm text-violet-300">
            <Link href="/login" className="font-semibold text-white hover:underline">
              {lang === 'en' ? '← Back to Login' : '← Kembali ke Log Masuk'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
