'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Plus, Trash2, CheckCircle, User, KeyRound } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useLang } from '@/lib/language-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type FamilyMember = { name: string; relationship: string }

const relationships = [
  { value: 'husband',        en: 'Husband',        ms: 'Suami' },
  { value: 'wife',           en: 'Wife',            ms: 'Isteri' },
  { value: 'son',            en: 'Son',             ms: 'Anak Lelaki' },
  { value: 'daughter',       en: 'Daughter',        ms: 'Anak Perempuan' },
  { value: 'grandfather',    en: 'Grandfather',     ms: 'Datuk' },
  { value: 'grandmother',    en: 'Grandmother',     ms: 'Nenek' },
  { value: 'son-in-law',     en: 'Son-in-law',      ms: 'Menantu Lelaki' },
  { value: 'daughter-in-law',en: 'Daughter-in-law', ms: 'Menantu Perempuan' },
  { value: 'father-in-law',  en: 'Father-in-law',   ms: 'Bapa Mertua' },
  { value: 'mother-in-law',  en: 'Mother-in-law',   ms: 'Ibu Mertua' },
]


export default function AccountPage() {
  const { user, updateUser } = useAuth()
  const { lang } = useLang()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [dob, setDob] = useState(user?.dob || '')
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '')
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(user?.familyMembers || [])
  const [newName, setNewName] = useState('')
  const [newRel, setNewRel] = useState('husband')
  const [saved, setSaved] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleChangePassword = async () => {
    setPwError('')
    if (newPassword.length < 8) {
      setPwError(lang === 'en' ? 'Password must be at least 8 characters.' : 'Kata laluan mesti sekurang-kurangnya 8 aksara.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError(lang === 'en' ? 'Passwords do not match.' : 'Kata laluan tidak sepadan.')
      return
    }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwLoading(false)
    if (error) {
      setPwError(error.message)
    } else {
      setPwSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSuccess(false), 3000)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setProfilePhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const addFamilyMember = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    setFamilyMembers((prev) => [...prev, { name: trimmed, relationship: newRel }])
    setNewName('')
    setNewRel('husband')
  }

  const updateMemberName = (i: number, name: string) =>
    setFamilyMembers((prev) => prev.map((m, j) => j === i ? { ...m, name } : m))

  const updateRelationship = (i: number, relationship: string) =>
    setFamilyMembers((prev) => prev.map((m, j) => j === i ? { ...m, relationship } : m))

  const removeFamilyMember = (i: number) =>
    setFamilyMembers((prev) => prev.filter((_, j) => j !== i))

  const handleSave = async () => {
    await updateUser({
      name: name.trim() || user?.name,
      email: email.trim() || user?.email,
      phone,
      dob,
      profilePhoto,
      familyMembers,
      avatar: (name.trim() || user?.name || '')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!user) return null

  return (
    <div className="space-y-5">
      {/* Hero header */}
      <div className="bg-[#2D1B5E] -mx-4 px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar className="h-24 w-24 overflow-hidden ring-4 ring-white/20">
              {profilePhoto
                ? <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
                : <AvatarFallback className="text-2xl font-bold bg-violet-700 text-white">{user.avatar}</AvatarFallback>
              }
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-violet-900 shadow hover:bg-violet-100 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            <p className="text-sm text-violet-300">{lang === 'en' ? 'My Account' : 'Akaun Saya'}</p>
          </div>
          {profilePhoto && (
            <button
              type="button"
              onClick={() => setProfilePhoto('')}
              className="text-xs text-violet-300 hover:text-red-300 transition-colors"
            >
              {lang === 'en' ? 'Remove photo' : 'Buang foto'}
            </button>
          )}
        </div>
      </div>

      {/* Personal details */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {lang === 'en' ? 'Personal Details' : 'Maklumat Peribadi'}
        </h3>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {lang === 'en' ? 'Full Name' : 'Nama Penuh'}
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {lang === 'en' ? 'Email Address' : 'Alamat Emel'}
          </label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {lang === 'en' ? 'Date of Birth' : 'Tarikh Lahir'}
          </label>
          <Input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="h-11"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {lang === 'en' ? 'Contact Number' : 'Nombor Telefon'}
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={lang === 'en' ? 'e.g. +65 9123 4567' : 'cth. +60 12-345 6789'}
            className="h-11"
          />
        </div>

      </div>

      {/* Change password */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {lang === 'en' ? 'Change Password' : 'Tukar Kata Laluan'}
          </h3>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {lang === 'en' ? 'New Password' : 'Kata Laluan Baru'}
          </label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={lang === 'en' ? 'At least 8 characters' : 'Sekurang-kurangnya 8 aksara'}
            className="h-11"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            {lang === 'en' ? 'Confirm New Password' : 'Sahkan Kata Laluan Baru'}
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={lang === 'en' ? 'Repeat new password' : 'Ulang kata laluan baru'}
            className="h-11"
          />
        </div>
        {pwError && (
          <p className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">{pwError}</p>
        )}
        {pwSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            {lang === 'en' ? 'Password updated successfully!' : 'Kata laluan berjaya dikemaskini!'}
          </div>
        )}
        <Button
          onClick={handleChangePassword}
          disabled={pwLoading || !newPassword || !confirmPassword}
          className="w-full h-11 bg-violet-700 hover:bg-violet-800 text-white"
        >
          {pwLoading
            ? (lang === 'en' ? 'Updating…' : 'Mengemaskini…')
            : (lang === 'en' ? 'Update Password' : 'Kemaskini Kata Laluan')}
        </Button>
      </div>

      {/* Family members */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {lang === 'en' ? 'Family Members' : 'Ahli Keluarga'}
        </h3>
        <p className="text-xs text-gray-400">
          {lang === 'en'
            ? 'List the family members under your household.'
            : 'Senaraikan ahli keluarga dalam isi rumah anda.'}
        </p>

        {familyMembers.length > 0 && (
          <div className="space-y-2">
            {familyMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-gray-50 p-2">
                <User className="h-4 w-4 text-gray-400 shrink-0 ml-1" />
                <div className="flex-1 min-w-0">
                  <Input
                    value={m.name}
                    onChange={(e) => updateMemberName(i, e.target.value)}
                    className="h-8 text-sm mb-1"
                  />
                  <select
                    value={m.relationship}
                    onChange={(e) => updateRelationship(i, e.target.value)}
                    className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {relationships.map((r) => (
                      <option key={r.value} value={r.value}>
                        {lang === 'en' ? r.en : r.ms}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeFamilyMember(i)}
                  className="shrink-0 text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new member row */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFamilyMember())}
            placeholder={lang === 'en' ? 'Full name' : 'Nama penuh'}
            className="h-10"
          />
          <div className="flex gap-2">
            <select
              value={newRel}
              onChange={(e) => setNewRel(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {relationships.map((r) => (
                <option key={r.value} value={r.value}>
                  {lang === 'en' ? r.en : r.ms}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addFamilyMember}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="h-4 w-4" />
          {lang === 'en' ? 'Changes saved!' : 'Perubahan disimpan!'}
        </div>
      )}

      <Button
        onClick={handleSave}
        className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white"
      >
        {lang === 'en' ? 'Save Changes' : 'Simpan Perubahan'}
      </Button>
    </div>
  )
}
