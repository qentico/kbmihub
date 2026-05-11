'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

const categories = [
  { value: 'sale', en: 'For Sale', ms: 'Untuk Dijual' },
  { value: 'service', en: 'Service', ms: 'Perkhidmatan' },
  { value: 'request', en: 'Request', ms: 'Permintaan' },
]

const minExpiry = (() => {
  const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10)
})()
const maxExpiry = (() => {
  const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString().slice(0, 10)
})()

export default function NewListingPage() {
  const { tr, lang } = useLang()
  const { user } = useAuth()
  const { addListing, addAuditEntry } = useData()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [htmlDescription, setHtmlDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('sale')
  const [expiresAt, setExpiresAt] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expiresAt) return
    addListing({
      title,
      description: htmlDescription.replace(/<[^>]+>/g, '').slice(0, 200),
      htmlDescription,
      price,
      category: category as 'sale' | 'service' | 'request',
      sellerId: user?.id || '',
      sellerName: user?.name || '',
      photos: [],
      expiresAt,
    })
    addAuditEntry(`Posted marketplace listing: "${title}"`, user?.name || '', 'Marketplace')
    setSuccess(true)
    setTimeout(() => router.push('/marketplace'), 1500)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CheckCircle className="h-16 w-16 text-emerald-500" />
        <h3 className="text-lg font-bold text-gray-900">
          {lang === 'en' ? 'Listing posted!' : 'Iklan dihantar!'}
        </h3>
        <p className="text-sm text-gray-500">
          {lang === 'en' ? 'Redirecting...' : 'Mengalih...'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/marketplace" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-xl font-bold text-gray-900">{tr.newListing}</h2>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {lang === 'en' ? 'Category' : 'Kategori'}
            </label>
            <div className="flex gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                    category === c.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {lang === 'en' ? c.en : c.ms}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {lang === 'en' ? 'Title' : 'Tajuk'}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'en' ? 'What are you offering?' : 'Apa yang anda tawarkan?'}
              required
              className="h-12"
            />
          </div>

          {/* Description – rich text */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {lang === 'en' ? 'Description' : 'Penerangan'}
            </label>
            <RichTextEditor
              content={htmlDescription}
              onChange={setHtmlDescription}
              placeholder={lang === 'en' ? 'Describe your item or service...' : 'Huraikan item atau perkhidmatan anda...'}
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{tr.price}</label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. SGD 50 / nego / Free"
              className="h-12"
            />
          </div>

          {/* Expiry date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {lang === 'en' ? 'Listing Expiry Date' : 'Tarikh Tamat Iklan'}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={minExpiry}
              max={maxExpiry}
              required
              className="h-12"
            />
            <p className="mt-1 text-xs text-gray-400">
              {lang === 'en'
                ? 'Listings are automatically removed after the expiry date (max 60 days).'
                : 'Iklan akan dipadam secara automatik selepas tarikh tamat (maks 60 hari).'}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
            {lang === 'en' ? `Posting as: ${user?.name}` : `Dihantar sebagai: ${user?.name}`}
          </div>

          <Button type="submit" className="h-12 w-full bg-emerald-700 hover:bg-emerald-800 text-white">
            {tr.submit}
          </Button>
        </form>
      </div>
    </div>
  )
}
