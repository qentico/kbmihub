'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Phone } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function FeedbackPage() {
  const { tr, lang } = useLang()
  const { user } = useAuth()
  const { addFeedback, addAuditEntry } = useData()

  const [content, setContent] = useState('')
  const [contactDetails, setContactDetails] = useState('')
  const [requestFollowUp, setRequestFollowUp] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return
    addFeedback({
      userId: user.id,
      userName: user.name,
      content,
      contactDetails,
      requestFollowUp,
      createdAt: new Date().toISOString().slice(0, 10),
    })
    addAuditEntry('Submitted feedback', user.name, 'Feedback')
    setContent('')
    setContactDetails('')
    setRequestFollowUp(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-[#2D1B5E] -mx-4 px-6 pt-6 pb-8 rounded-b-3xl overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/family" className="text-white/70 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-white">{tr.feedback}</h2>
            <p className="text-sm text-violet-300 mt-0.5">
              {lang === 'en' ? 'Share your thoughts with the admin' : 'Kongsikan pendapat anda dengan admin'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-1">
          {lang === 'en' ? 'Submit Feedback' : 'Hantar Maklum Balas'}
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          {lang === 'en'
            ? 'Your feedback is sent directly to the admin team.'
            : 'Maklum balas anda dihantar terus kepada pasukan admin.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={lang === 'en' ? 'Share your thoughts, suggestions or concerns...' : 'Kongsikan pendapat, cadangan atau kebimbangan anda...'}
            rows={4}
            required
          />

          {/* Contact details */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              {lang === 'en' ? 'Contact Details (phone / email)' : 'Maklumat Hubungi (telefon / emel)'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. 9123 4567 or name@email.com' : 'cth. 9123 4567 atau nama@emel.com'}
                className="h-11 pl-9"
              />
            </div>
          </div>

          {/* Request follow-up toggle */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div>
              <div className="text-sm font-medium text-gray-700">
                {lang === 'en' ? 'Request a follow-up' : 'Minta tindak balas'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {lang === 'en' ? 'Admin will reach out to you via the contact details above.' : 'Admin akan menghubungi anda melalui maklumat di atas.'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRequestFollowUp((v) => !v)}
              className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${requestFollowUp ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${requestFollowUp ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {submitted && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              <CheckCircle className="h-4 w-4" />
              {lang === 'en' ? 'Feedback submitted! The admin team will review it.' : 'Maklum balas dihantar! Pasukan admin akan menyemaknya.'}
            </div>
          )}

          <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-11">
            {lang === 'en' ? 'Submit Feedback' : 'Hantar Maklum Balas'}
          </Button>
        </form>
      </div>
    </div>
  )
}
