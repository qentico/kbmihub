'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, X, Check, ChevronUp, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { useData } from '@/lib/data-context'
import { ExcoMember } from '@/lib/mock-data'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const EMPTY_FORM = { name: '', position: '', userId: '' }

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

export default function ExcoPage() {
  const { tr } = useLang()
  const { user } = useAuth()
  const { excoMembers, excoTerm, setExcoTerm, addExcoMember, updateExcoMember, deleteExcoMember, reorderExcoMembers } = useData()

  const isSuperAdmin = user?.role === 'super_admin'

  // Term editing
  const [editingTerm, setEditingTerm] = useState(false)
  const [termInput, setTermInput] = useState(excoTerm)

  // Member add / edit
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowAdd(true)
  }

  const openEdit = (m: ExcoMember) => {
    setForm({ name: m.name, position: m.position, userId: m.userId })
    setEditingId(m.id)
    setShowAdd(false)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.position.trim()) return
    const avatar = initials(form.name)
    if (editingId) {
      updateExcoMember(editingId, { ...form, avatar })
      setEditingId(null)
    } else {
      addExcoMember({ ...form, avatar })
      setShowAdd(false)
    }
    setForm(EMPTY_FORM)
  }

  const handleCancel = () => {
    setShowAdd(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const saveTerm = () => {
    if (termInput.trim()) setExcoTerm(termInput.trim())
    setEditingTerm(false)
  }

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="relative bg-[#2D1B5E] -mx-4 px-6 pt-6 pb-8 rounded-b-3xl overflow-hidden">
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Link href="/family" className="text-white/70 hover:text-white mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-black text-white">{tr.exco}</h2>
              {/* Editable term label */}
              {editingTerm ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    autoFocus
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveTerm(); if (e.key === 'Escape') setEditingTerm(false) }}
                    className="text-sm bg-white/15 text-white rounded-lg px-2 py-0.5 outline-none border border-white/30 w-36"
                  />
                  <button onClick={saveTerm} className="text-white/80 hover:text-white">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingTerm(false)} className="text-white/60 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm text-violet-300">{excoTerm}</p>
                  {isSuperAdmin && (
                    <button onClick={() => { setTermInput(excoTerm); setEditingTerm(true) }} className="text-violet-400 hover:text-white">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {isSuperAdmin && !editingTerm && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Add form */}
      {showAdd && isSuperAdmin && (
        <MemberForm form={form} setForm={setForm} onSave={handleSave} onCancel={handleCancel} title="Add Member" />
      )}

      {/* Member list */}
      <div className="space-y-3">
        {excoMembers.map((member, index) => (
          <div key={member.id}>
            {editingId === member.id ? (
              <MemberForm form={form} setForm={setForm} onSave={handleSave} onCancel={handleCancel} title="Edit Member" />
            ) : (
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                {isSuperAdmin && (
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      onClick={() => reorderExcoMembers(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 rounded-md text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => reorderExcoMembers(index, index + 1)}
                      disabled={index === excoMembers.length - 1}
                      className="p-1 rounded-md text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <Avatar className="h-14 w-14 bg-emerald-100 shrink-0">
                  <AvatarFallback className="text-base font-semibold text-emerald-800">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{member.name}</div>
                  <div className="text-sm font-medium text-emerald-700">{member.position}</div>
                </div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(member)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteExcoMember(member.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {excoMembers.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No exco members yet.</p>
        )}
      </div>
    </div>
  )
}

function MemberForm({
  form,
  setForm,
  onSave,
  onCancel,
  title,
}: {
  form: typeof EMPTY_FORM
  setForm: (f: typeof EMPTY_FORM) => void
  onSave: () => void
  onCancel: () => void
  title: string
}) {
  return (
    <div className="rounded-2xl bg-white border border-violet-100 shadow-md p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <Input
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="text-sm"
      />
      <Input
        placeholder="Position (e.g. Pengerusi)"
        value={form.position}
        onChange={(e) => setForm({ ...form, position: e.target.value })}
        className="text-sm"
      />
      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={onSave} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white gap-1.5">
          <Check className="h-4 w-4" /> Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="gap-1.5">
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  )
}
