'use client'

import { useState, useRef } from 'react'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaItem } from '@/lib/mock-data'

interface MediaCarouselProps {
  media: MediaItem[]
  aspectRatio?: 'square' | 'portrait' | 'landscape'
}

export default function MediaCarousel({ media, aspectRatio = 'landscape' }: MediaCarouselProps) {
  const [current, setCurrent] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!media || media.length === 0) return null

  const aspectClass = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[4/3]',
  }[aspectRatio]

  const goTo = (index: number) => {
    setCurrent(index)
    scrollRef.current?.scrollTo({ left: index * scrollRef.current.offsetWidth, behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth)
    setCurrent(index)
  }

  return (
    <div className="relative w-full select-none">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {media.map((item, i) => (
          <div key={i} className={`relative flex-none w-full ${aspectClass} bg-gray-100 snap-start`}>
            {item.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.caption || `Media ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="relative h-full w-full bg-black">
                <video
                  src={item.url}
                  className="h-full w-full object-contain"
                  controls
                  playsInline
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
              </div>
            )}
            {/* Caption overlay */}
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <p className="text-xs text-white/90">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next arrows (only if more than 1 slide) */}
      {media.length > 1 && (
        <>
          {current > 0 && (
            <button
              onClick={() => goTo(current - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {current < media.length - 1 && (
            <button
              onClick={() => goTo(current + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Slide counter badge */}
      {media.length > 1 && (
        <div className="absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          {current + 1}/{media.length}
        </div>
      )}
    </div>
  )
}
