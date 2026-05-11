'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const { lang } = useLang()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
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
            {lang === 'en' ? 'Forgot Password?' : 'Lupa Kata Laluan?'}
          </h2>
          <p className="text-sm text-violet-300 mb-5">
            {lang === 'en'
              ? "Enter your email and we'll send a reset link."
              : 'Masukkan emel anda dan kami akan hantar pautan penetapan semula.'}
          </p>

          {sent ? (
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-4 text-sm text-emerald-300 text-center leading-relaxed">
              {lang === 'en'
                ? '✓ Reset link sent! Check your email inbox.'
                : '✓ Pautan dihantar! Semak peti masuk emel anda.'}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-violet-300 uppercase tracking-wide">
                  {lang === 'en' ? 'Email Address' : 'Alamat Emel'}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
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
                  ? (lang === 'en' ? 'Sending…' : 'Menghantar…')
                  : (lang === 'en' ? 'Send Reset Link' : 'Hantar Pautan')}
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
