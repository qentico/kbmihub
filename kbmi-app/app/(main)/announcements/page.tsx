'use client'

import Link from 'next/link'
import { ArrowLeft, Pin, MessageCircle, Heart } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { useData } from '@/lib/data-context'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import MediaCarousel from '@/components/MediaCarousel'

export default function AnnouncementsPage() {
  const { tr, lang } = useLang()
  const { announcements } = useData()

  const sorted = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-4">
      <div className="relative bg-[#2D1B5E] -mx-4 px-6 pt-6 pb-8 rounded-b-3xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bulletin.png"
          alt=""
          className="absolute right-0 top-0 h-36 w-auto object-cover object-top pointer-events-none"
        />
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/family" className="text-white/70 hover:text-white shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-white">{tr.announcements}</h2>
            <p className="text-sm text-violet-300 mt-0.5">{lang === 'en' ? 'Latest updates from the family' : 'Kemas kini terkini'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((ann) => (
          <div key={ann.id} className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
            {ann.media.length > 0 && (
              <MediaCarousel media={ann.media} aspectRatio="landscape" />
            )}

            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-8 w-8 bg-emerald-100">
                  <AvatarFallback className="text-xs font-semibold text-emerald-800">
                    {ann.authorName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{ann.authorName}</span>
                    {ann.isPinned && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs flex items-center gap-1 py-0">
                        <Pin className="h-2.5 w-2.5" />
                        {lang === 'en' ? 'Pinned' : 'Disematkan'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{ann.createdAt}</div>
                </div>
              </div>

              <Link href={`/announcements/${ann.id}`}>
                <h3 className="font-bold text-gray-900 mb-1 leading-snug">{ann.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{ann.content}</p>
              </Link>

              <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">Like</span>
                </button>
                <Link
                  href={`/announcements/${ann.id}`}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{ann.comments.length} {tr.comments}</span>
                </Link>
                <Link href={`/announcements/${ann.id}`} className="ml-auto text-xs font-medium text-emerald-700 hover:underline">
                  {tr.readMore}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
