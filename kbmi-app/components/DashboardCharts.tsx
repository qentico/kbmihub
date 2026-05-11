'use client'

import {
  BarChart, Bar, LabelList, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

const pages = [
  { key: 'Bulletin',      color: '#f97316', values: [45, 52, 48, 61, 58, 70] },
  { key: 'Events',        color: '#ef4444', values: [38, 41, 45, 39, 53, 62] },
  { key: 'Marketplace',   color: '#8b5cf6', values: [29, 35, 42, 38, 49, 55] },
  { key: 'Contributions', color: '#f59e0b', values: [25, 28, 30, 35, 33, 40] },
]

const listingData = months.map((month, i) => ({
  month,
  'For Sale': [3, 5, 4, 7, 6, 8][i],
  Service:    [2, 3, 4, 3, 5, 4][i],
  Request:    [1, 2, 1, 3, 2, 3][i],
}))

const moneyData = months.map((month, i) => ({
  month,
  amount: [180, 245, 310, 420, 380, 510][i],
}))

export default function DashboardCharts({ lang }: { lang: string }) {
  return (
    <div className="space-y-8">

      {/* ── KBMI page clicks — one mini chart per page ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
          {lang === 'en' ? 'KBMI Hub — Page Clicks by Section' : 'KBMI Hub — Klik Mengikut Seksyen'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {pages.map(({ key, color, values }) => {
            const data = months.map((month, i) => ({ month, clicks: values[i] }))
            return (
              <div key={key} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-semibold mb-2" style={{ color }}>{key}</p>
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={data} barSize={10} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 10, borderRadius: 6, padding: '4px 8px' }}
                      formatter={(v) => [v, lang === 'en' ? 'Clicks' : 'Klik']}
                    />
                    <Bar dataKey="clicks" fill={color} radius={[3, 3, 0, 0]}>
                        <LabelList dataKey="clicks" position="top" style={{ fontSize: 8, fill: '#6b7280', fontWeight: 600 }} />
                      </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Marketplace distribution pie ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {lang === 'en' ? 'Marketplace Distribution %' : 'Agihan Pasaran %'}
        </p>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={160}>
            <PieChart>
              <Pie
                data={[
                  { name: 'For Sale', value: 33 },
                  { name: 'Service',  value: 21 },
                  { name: 'Request',  value: 12 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={68}
                dataKey="value"
                paddingAngle={3}
              >
                <Cell fill="#10b981" />
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v, name) => {
                  const total = 33 + 21 + 12
                  return [`${((Number(v) / total) * 100).toFixed(1)}%`, name]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3 flex-1">
            {[
              { label: 'For Sale', value: 33, color: '#10b981' },
              { label: 'Service',  value: 21, color: '#3b82f6' },
              { label: 'Request',  value: 12, color: '#f59e0b' },
            ].map(({ label, value, color }) => {
              const pct = ((value / 66) * 100).toFixed(1)
              return (
                <div key={label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-0.5 h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Marketplace listings by type ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {lang === 'en' ? 'Marketplace Listings by Type' : 'Senarai Pasaran Mengikut Jenis'}
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={listingData} barSize={12} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="For Sale" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Service"  fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Request"  fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          {[['For Sale', '#10b981'], ['Service', '#3b82f6'], ['Request', '#f59e0b']].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Money transacted ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {lang === 'en' ? 'Marketplace — Money Transacted (SGD)' : 'Pasaran — Wang Ditukar (SGD)'}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={moneyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
              formatter={(v) => [`SGD ${v}`, lang === 'en' ? 'Transacted' : 'Ditukar']}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
