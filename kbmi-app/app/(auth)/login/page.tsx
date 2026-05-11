'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useLang } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const { login } = useAuth()
  const { tr, lang, setLang } = useLang()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/family')
    }
  }

  return (
    <div className="min-h-screen bg-[#2D1B5E] flex flex-col items-center pt-10 pb-0 px-6">
      <div className="w-full max-w-xs">
      {/* Lang toggle — top right */}
      <div className="absolute top-6 right-6 z-20 flex rounded-full border border-white/20 overflow-hidden text-xs">
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 font-medium transition-colors ${lang === 'en' ? 'bg-white text-indigo-900' : 'text-white/60 hover:text-white'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLang('ms')}
          className={`px-3 py-1.5 font-medium transition-colors ${lang === 'ms' ? 'bg-white text-indigo-900' : 'text-white/60 hover:text-white'}`}
        >
          BM
        </button>
      </div>

      {/* App name */}
      <div className="mb-6 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/20">
            <span className="text-lg font-black text-white">K</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{tr.appName}</h1>
            <p className="text-xs text-violet-300">{tr.loginDesc}</p>
          </div>
        </div>
      </div>

      {/* Login card */}
      <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 shadow-2xl">
        <h2 className="mb-5 text-lg font-bold text-white">{tr.welcomeBack}</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-violet-300 uppercase tracking-wide">
              {tr.email}
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-violet-300 uppercase tracking-wide">
                {tr.password}
              </label>
              <Link href="/forgot-password" className="text-xs text-violet-300 hover:text-white transition-colors">
                {lang === 'en' ? 'Forgot password?' : 'Lupa kata laluan?'}
              </Link>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            className="h-12 w-full bg-white text-indigo-900 font-bold hover:bg-violet-100 transition-colors mt-1"
          >
            {loading ? tr.loading : tr.login}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-violet-300">
          {tr.noAccount}{' '}
          <Link href="/signup" className="font-semibold text-white hover:underline">
            {tr.signup}
          </Link>
        </div>
      </div>

      {/* Family illustration — below the form */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/family-hero.png"
        alt=""
        className="w-full h-auto mt-4 object-contain"
      />
      <p className="text-center text-xs text-white/30 mt-2 pb-6">Powered by Qentico</p>
      </div>
    </div>
  )
}
