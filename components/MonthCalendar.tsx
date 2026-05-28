'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Event } from '@/lib/mock-data'
import { useLang } from '@/lib/language-context'

interface MonthCalendarProps {
  events: Event[]
  onDayClick: (date: string) => void
  selectedDate: string | null
}

const DOW_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DOW_MS = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_MS = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember']

export default function MonthCalendar({ events, onDayClick, selectedDate }: MonthCalendarProps) {
  const { lang } = useLang()
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()   // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  // Build grid cells (always 6 rows × 7 = 42 cells)
  type Cell = { date: string; day: number; currentMonth: boolean }
  const cells: Cell[] = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const m = month === 0 ? 12 : month
    const y = month === 0 ? year - 1 : year
    cells.push({ date: `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, currentMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, day: d, currentMonth: true })
  }
  let nextDay = 1
  while (cells.length < 42) {
    const m = month === 11 ? 1 : month + 2
    const y = month === 11 ? year + 1 : year
    cells.push({ date: `${y}-${String(m).padStart(2,'0')}-${String(nextDay).padStart(2,'0')}`, day: nextDay++, currentMonth: false })
  }

  // Map date → events
  const eventsByDate: Record<string, Event[]> = {}
  events.forEach((ev) => {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = []
    eventsByDate[ev.date].push(ev)
  })

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const DOW = lang === 'en' ? DOW_EN : DOW_MS
  const MONTHS = lang === 'en' ? MONTHS_EN : MONTHS_MS

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-700 text-white">
        <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-emerald-600 transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-semibold text-base">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-emerald-600 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DOW.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const evs = eventsByDate[cell.date] || []
          const isToday = cell.date === todayStr
          const isSelected = cell.date === selectedDate
          const hasEvents = evs.length > 0

          return (
            <button
              key={i}
              onClick={() => hasEvents && onDayClick(cell.date)}
              className={`relative flex flex-col items-center py-1.5 border-b border-r border-gray-50 transition-colors
                ${!cell.currentMonth ? 'text-gray-200' : 'text-gray-800'}
                ${hasEvents ? 'cursor-pointer hover:bg-emerald-50' : 'cursor-default'}
                ${isSelected ? 'bg-emerald-50' : ''}
              `}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium
                ${isToday ? 'bg-emerald-700 text-white' : ''}
              `}>
                {cell.day}
              </span>
              {/* Event dots */}
              {hasEvents && cell.currentMonth && (
                <div className="flex gap-0.5 mt-0.5">
                  {evs.slice(0, 3).map((_, di) => (
                    <div key={di} className="h-1 w-1 rounded-full bg-emerald-500" />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
