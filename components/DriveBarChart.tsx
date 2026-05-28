'use client'

import {
  BarChart, Bar, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { ContributionDrive } from '@/lib/mock-data'

interface Props {
  lang: string
  drives: ContributionDrive[]
}

export default function DriveBarChart({ lang, drives }: Props) {
  const collectedKey = lang === 'en' ? 'Collected' : 'Terkumpul'
  const spentKey     = lang === 'en' ? 'Spent'     : 'Dibelanjakan'
  const targetKey    = lang === 'en' ? 'Target'    : 'Sasaran'

  const driveData = drives.slice(0, 5).map(d => {
    const collected = d.contributions.filter(c => c.confirmed).reduce((s, c) => s + c.amount, 0)
    const spent = d.expenses.reduce((s, e) => s + e.amount, 0)
    const target = d.targetAmount
    return {
      name: d.title.length > 18 ? d.title.slice(0, 18) + '…' : d.title,
      [collectedKey]: collected,
      [spentKey]: spent,
      [targetKey]: target,
      collectedLabel: target > 0 ? `${Math.round((collected / target) * 100)}%` : '0%',
      spentLabel: target > 0 ? `${Math.round((spent / target) * 100)}%` : '0%',
      targetLabel: '100%',
    }
  })

  if (driveData.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">{lang === 'en' ? 'No drives yet' : 'Tiada kutipan dana lagi'}</p>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={driveData} barCategoryGap="30%" margin={{ top: 16, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 8 }}
          formatter={(v, name) => {
            if (name === collectedKey || name === spentKey || name === targetKey) return [`SGD ${v}`, name]
            return [v, name as string]
          }}
        />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
        <Bar dataKey={collectedKey} fill="#10b981" radius={[4, 4, 0, 0]} barSize={14}>
          <LabelList dataKey="collectedLabel" position="top" style={{ fontSize: 8, fill: '#059669', fontWeight: 700 }} />
        </Bar>
        <Bar dataKey={spentKey} fill="#f97316" radius={[4, 4, 0, 0]} barSize={14}>
          <LabelList dataKey="spentLabel" position="top" style={{ fontSize: 8, fill: '#ea580c', fontWeight: 700 }} />
        </Bar>
        <Bar dataKey={targetKey} fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={14}>
          <LabelList dataKey="targetLabel" position="top" style={{ fontSize: 8, fill: '#9ca3af', fontWeight: 700 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
