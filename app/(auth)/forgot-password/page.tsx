'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Update this to the admin's WhatsApp number
const ADMIN_WHATSAPP = '+601XXXXXXXXX'

export default function ForgotPasswordPage() {
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.from('password_reset_requests').insert({
      email: email.trim().toLowerCase(),
      name: name.trim() || null,
      message: message.trim() || null,
    })
    setLoading(false)
    if (error) {
      setError(lang === 'en' ? 'Something went wrong. Please try again.' : 'Ralat berlaku. Sila cuba semula.')
    } else {
      setSent(true)
    }
  }

  const waLink = `https://wa.me/${ADMIN_WHATSAPP.replace(/\D/g, '')}`

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

          {sent ? (
            <div className="space-y-4 mt-4">
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-4 text-sm text-emerald-300 text-center leading-relaxed">
                {lang === 'en'
                  ? '✓ Request received! Our admin will reach out to you shortly.'
                  : '✓ Permintaan diterima! Admin kami akan menghubungi anda tidak lama lagi.'}
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-4 text-sm text-violet-200 leading-relaxed space-y-3">
                <p className="font-semibold text-white">
                  {lang === 'en' ? 'What happens next?' : 'Apa yang berlaku seterusnya?'}
                </p>
                <p>
                  {lang === 'en'
                    ? 'The admin will set a temporary password for you and send it via WhatsApp. Use it to log in, then change your password from Account Settings.'
                    : 'Admin akan menetapkan kata laluan sementara dan menghantarnya melalui WhatsApp. Gunakan ia untuk log masuk, kemudian tukar kata laluan dari Tetapan Akaun.'}
                </p>
                <p className="text-xs text-violet-300">
                  {lang === 'en' ? 'Need it urgently?' : 'Perlukan segera?'}
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-500/20 border border-green-400/30 px-4 py-2.5 text-sm font-semibold text-green-300 hover:bg-green-500/30 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {lang === 'en' ? 'WhatsApp Admin' : 'WhatsApp Admin'}
                </a>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-violet-300 mb-5">
                {lang === 'en'
                  ? 'Submit your details and our admin will set a temporary password for you via WhatsApp.'
                  : 'Hantar maklumat anda dan admin kami akan tetapkan kata laluan sementara melalui WhatsApp.'}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-violet-300 uppercase tracking-wide">
                    {lang === 'en' ? 'Your Name' : 'Nama Anda'}
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'en' ? 'Ahmad Bin Ali' : 'Ahmad Bin Ali'}
                    required
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-violet-400 focus:ring-violet-400"
                  />
                </div>
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
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-violet-300 uppercase tracking-wide">
                    {lang === 'en' ? 'Message (optional)' : 'Mesej (pilihan)'}
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === 'en' ? 'Any additional info for the admin…' : 'Maklumat tambahan untuk admin…'}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-violet-400 focus:ring-violet-400 resize-none text-sm"
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
                    : (lang === 'en' ? 'Send Request' : 'Hantar Permintaan')}
                </Button>

                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-xs text-violet-300 text-center leading-relaxed">
                  {lang === 'en'
                    ? 'Or WhatsApp us directly:'
                    : 'Atau WhatsApp kami terus:'}
                  {' '}
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-300 hover:underline">
                    {ADMIN_WHATSAPP}
                  </a>
                </div>
              </form>
            </>
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
