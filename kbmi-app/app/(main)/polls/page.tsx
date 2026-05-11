'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Lock } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { useData } from '@/lib/data-context'
import { Poll } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

const today = new Date().toISOString().slice(0, 10)

export default function PollsPage() {
  const { lang } = useLang()
  const { user } = useAuth()
  const { polls, votePoll } = useData()

  const [pending, setPending] = useState<Record<string, string[]>>({})

  const sorted = [...polls].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
    return b.createdAt.localeCompare(a.createdAt)
  })

  const userVotes = (poll: Poll) =>
    poll.options.filter((o) => o.votes.includes(user?.id ?? '')).map((o) => o.id)

  const hasVoted = (poll: Poll) => userVotes(poll).length > 0
  const isClosed = (poll: Poll) => !poll.isActive || poll.expiresAt < today
  const totalVotes = (poll: Poll) => poll.options.reduce((s, o) => s + o.votes.length, 0)

  const togglePending = (poll: Poll, optionId: string) => {
    if (hasVoted(poll) || isClosed(poll)) return
    setPending((prev) => {
      const current = prev[poll.id] ?? []
      if (poll.allowMultiple) {
        return {
          ...prev,
          [poll.id]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        }
      }
      return { ...prev, [poll.id]: [optionId] }
    })
  }

  const submitVote = (poll: Poll) => {
    const selected = pending[poll.id] ?? []
    if (!selected.length || !user) return
    votePoll(poll.id, selected, user.id)
    setPending((prev) => { const n = { ...prev }; delete n[poll.id]; return n })
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-[#2D1B5E] -mx-4 px-6 pt-6 pb-8 rounded-b-3xl overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/family" className="text-white/70 hover:text-white shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-white">
              {lang === 'en' ? 'Polls' : 'Undian'}
            </h2>
            <p className="text-sm text-violet-300 mt-0.5">
              {lang === 'en' ? 'Have your say' : 'Luahkan pendapat anda'}
            </p>
          </div>
        </div>
      </div>

      {sorted.length === 0 && (
        <div className="py-16 text-center text-sm text-gray-400">
          {lang === 'en' ? 'No polls yet.' : 'Tiada undian lagi.'}
        </div>
      )}

      {sorted.map((poll) => {
        const voted = hasVoted(poll)
        const closed = isClosed(poll)
        const total = totalVotes(poll)
        const myVotes = userVotes(poll)
        const myPending = pending[poll.id] ?? []
        const showResults = voted || closed

        return (
          <div key={poll.id} className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-50">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-gray-900 leading-snug flex-1">{poll.question}</p>
                {closed
                  ? <span className="flex items-center gap-1 shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                      <Lock className="h-2.5 w-2.5" />
                      {lang === 'en' ? 'Closed' : 'Ditutup'}
                    </span>
                  : <span className="flex items-center gap-1 shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                      <Clock className="h-2.5 w-2.5" />
                      {lang === 'en' ? `Until ${poll.expiresAt}` : `Sehingga ${poll.expiresAt}`}
                    </span>
                }
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {poll.allowMultiple
                  ? (lang === 'en' ? 'Multiple choice · ' : 'Pilihan berbilang · ')
                  : (lang === 'en' ? 'Single choice · ' : 'Pilihan tunggal · ')}
                {lang === 'en' ? `${total} vote${total !== 1 ? 's' : ''}` : `${total} undian`}
                {' · '}{poll.createdByName}
              </p>
            </div>

            {/* Options */}
            <div className="px-4 py-3 space-y-2">
              {poll.options.map((option) => {
                const pct = total > 0 ? Math.round((option.votes.length / total) * 100) : 0
                const isMyVote = myVotes.includes(option.id)
                const isPendingSelected = myPending.includes(option.id)

                return (
                  <button
                    key={option.id}
                    onClick={() => togglePending(poll, option.id)}
                    disabled={voted || closed}
                    className={`relative w-full rounded-xl border text-left overflow-hidden transition-colors ${
                      isMyVote
                        ? 'border-violet-400 bg-violet-50'
                        : isPendingSelected
                        ? 'border-violet-300 bg-violet-50/60'
                        : showResults
                        ? 'border-gray-100 bg-gray-50 cursor-default'
                        : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/40'
                    }`}
                  >
                    {/* Progress fill */}
                    {showResults && (
                      <div
                        className={`absolute inset-y-0 left-0 rounded-xl transition-all ${isMyVote ? 'bg-violet-200/60' : 'bg-gray-200/60'}`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between px-3 py-2.5 gap-2">
                      <div className="flex items-center gap-2">
                        {!showResults && (
                          <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            isPendingSelected ? 'border-violet-500 bg-violet-500' : 'border-gray-300'
                          }`}>
                            {isPendingSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                        )}
                        {isMyVote && <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-600" />}
                        <span className={`text-sm font-medium ${isMyVote ? 'text-violet-800' : 'text-gray-700'}`}>
                          {option.text}
                        </span>
                      </div>
                      {showResults && (
                        <span className={`text-xs font-bold shrink-0 ${isMyVote ? 'text-violet-700' : 'text-gray-500'}`}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Vote button */}
            {!voted && !closed && (
              <div className="px-4 pb-4">
                <Button
                  onClick={() => submitVote(poll)}
                  disabled={myPending.length === 0}
                  className="w-full h-10 bg-violet-700 hover:bg-violet-800 text-white text-sm disabled:opacity-40"
                >
                  {lang === 'en' ? 'Submit Vote' : 'Hantar Undian'}
                </Button>
              </div>
            )}

            {voted && (
              <div className="px-4 pb-4">
                <p className="text-center text-xs text-violet-600 font-medium">
                  {lang === 'en' ? '✓ You have voted' : '✓ Anda telah mengundi'}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
