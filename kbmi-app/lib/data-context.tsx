'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  MOCK_ANNOUNCEMENTS, MOCK_EVENTS, MOCK_USERS, MOCK_DRIVES, MOCK_NOTIFICATIONS, MOCK_FEEDBACK, MOCK_LISTINGS, MOCK_CHATS, MOCK_EXCO, MOCK_AUDIT, MOCK_POLLS,
  Announcement, Event, User, ContributionDrive, RSVP, MediaItem, Expense, Notification, FeedbackItem, MarketplaceListing, GroupChat, ExcoMember, AuditEntry, AuditCategory, Poll,
} from './mock-data'

interface DataContextValue {
  // Announcements
  announcements: Announcement[]
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'comments'>) => void
  updateAnnouncement: (id: string, updates: Partial<Omit<Announcement, 'id' | 'comments'>>) => void
  deleteAnnouncement: (id: string) => void
  addComment: (announcementId: string, comment: Announcement['comments'][0]) => void

  // Events
  events: Event[]
  addEvent: (ev: Omit<Event, 'id' | 'rsvps'>) => void
  updateEvent: (id: string, updates: Partial<Omit<Event, 'id' | 'rsvps'>>) => void
  deleteEvent: (id: string) => void
  updateRSVP: (eventId: string, rsvp: RSVP) => void

  // Users
  users: User[]
  toggleHeadOfFamily: (userId: string) => void
  setUserRole: (userId: string, role: 'super_admin' | 'admin' | 'member') => void
  deleteUser: (userId: string) => void
  updateUserById: (id: string, updates: Partial<User>) => void

  // Drives
  drives: ContributionDrive[]
  addDrive: (drive: Omit<ContributionDrive, 'id' | 'contributions' | 'status' | 'expenses'>) => void
  updateDrive: (id: string, updates: Partial<Omit<ContributionDrive, 'id' | 'contributions' | 'expenses'>>) => void
  toggleDriveStatus: (id: string) => void
  confirmContribution: (driveId: string, contribId: string, confirmedBy: string) => void
  toggleContributionConfirm: (driveId: string, contribId: string, confirmedBy: string) => void
  recordContribution: (driveId: string, userId: string, userName: string, amount: number, confirmedBy: string) => void
  removeContribution: (driveId: string, contribId: string) => void
  addExpense: (driveId: string, expense: Omit<Expense, 'id'>) => void

  // Notifications
  notifications: Notification[]
  markNotificationRead: (notifId: string, userId: string) => void
  markAllRead: (userId: string) => void

  // Feedback
  feedback: FeedbackItem[]
  addFeedback: (item: Omit<FeedbackItem, 'id' | 'status'>) => void
  markFeedbackResolved: (id: string, byName: string) => void
  reopenFeedback: (id: string, byName: string) => void
  deleteFeedback: (id: string) => void

  // Marketplace
  listings: MarketplaceListing[]
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'createdAt'>) => void
  deleteListing: (id: string) => void
  pushExpiryNotification: (listing: MarketplaceListing) => void
  toggleListingRead: (listingId: string, userId: string) => void

  // Social Media / Group Chats
  chats: GroupChat[]
  addChat: (chat: Omit<GroupChat, 'id'>) => void
  updateChat: (id: string, updates: Partial<Omit<GroupChat, 'id'>>) => void
  deleteChat: (id: string) => void

  // Finance override (super admin manual figures)
  financeStats: { collected: number; spent: number } | null
  setFinanceStats: (stats: { collected: number; spent: number } | null) => void

  // Exco
  excoMembers: ExcoMember[]
  excoTerm: string
  setExcoTerm: (term: string) => void
  addExcoMember: (member: Omit<ExcoMember, 'id'>) => void
  updateExcoMember: (id: string, updates: Partial<Omit<ExcoMember, 'id'>>) => void
  deleteExcoMember: (id: string) => void

  // Audit log
  auditLog: AuditEntry[]
  addAuditEntry: (activity: string, initiatedBy: string, category: AuditCategory) => void

  // Polls
  polls: Poll[]
  addPoll: (poll: Omit<Poll, 'id' | 'createdAt'>) => void
  updatePoll: (id: string, updates: Partial<Omit<Poll, 'id' | 'createdAt'>>) => void
  deletePoll: (id: string) => void
  votePoll: (pollId: string, optionIds: string[], userId: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS)
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS)
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [drives, setDrives] = useState<ContributionDrive[]>(MOCK_DRIVES)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [feedback, setFeedback] = useState<FeedbackItem[]>(MOCK_FEEDBACK)
  const [listings, setListings] = useState<MarketplaceListing[]>(MOCK_LISTINGS)
  const [chats, setChats] = useState<GroupChat[]>(MOCK_CHATS)
  const [financeStats, setFinanceStats] = useState<{ collected: number; spent: number } | null>(null)
  const [excoMembers, setExcoMembers] = useState<ExcoMember[]>(MOCK_EXCO)
  const [excoTerm, setExcoTerm] = useState('Term 2025')
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(MOCK_AUDIT)
  const [polls, setPolls] = useState<Poll[]>(MOCK_POLLS)

  // ── Internal notification helper ───────────────────────────────────────────
  const pushNotification = (notif: Omit<Notification, 'id' | 'readBy'>) =>
    setNotifications((prev) => [{ ...notif, id: `n${Date.now()}`, readBy: [] }, ...prev])

  // ── Announcements ──────────────────────────────────────────────────────────
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'comments'>) => {
    setAnnouncements((prev) => [{ ...ann, id: `a${Date.now()}`, comments: [] }, ...prev])
    pushNotification({
      type: 'announcement',
      title: ann.title,
      message: ann.content?.slice(0, 100) || ann.title,
      createdAt: ann.createdAt,
    })
  }

  const updateAnnouncement = (id: string, updates: Partial<Omit<Announcement, 'id' | 'comments'>>) =>
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))

  const deleteAnnouncement = (id: string) =>
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))

  const addComment = (announcementId: string, comment: Announcement['comments'][0]) =>
    setAnnouncements((prev) =>
      prev.map((a) => a.id === announcementId ? { ...a, comments: [...a.comments, comment] } : a)
    )

  // ── Events ─────────────────────────────────────────────────────────────────
  const addEvent = (ev: Omit<Event, 'id' | 'rsvps'>) => {
    setEvents((prev) => [...prev, { ...ev, id: `e${Date.now()}`, rsvps: [] }])
    pushNotification({
      type: 'event',
      title: ev.title,
      message: `${ev.date} · ${ev.location || ''}`,
      createdAt: new Date().toISOString().slice(0, 10),
    })
  }

  const updateEvent = (id: string, updates: Partial<Omit<Event, 'id' | 'rsvps'>>) =>
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))

  const deleteEvent = (id: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== id))

  const updateRSVP = (eventId: string, rsvp: RSVP) =>
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev
        const idx = ev.rsvps.findIndex((r) => r.userId === rsvp.userId)
        if (idx >= 0) {
          const updated = [...ev.rsvps]
          updated[idx] = rsvp
          return { ...ev, rsvps: updated }
        }
        return { ...ev, rsvps: [...ev.rsvps, rsvp] }
      })
    )

  // ── Users ──────────────────────────────────────────────────────────────────
  const toggleHeadOfFamily = (userId: string) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isHeadOfFamily: !u.isHeadOfFamily } : u)))

  const setUserRole = (userId: string, role: 'super_admin' | 'admin' | 'member') =>
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    )

  const deleteUser = (userId: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== userId))

  const updateUserById = (id: string, updates: Partial<User>) =>
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...updates } : u))

  // ── Drives ─────────────────────────────────────────────────────────────────
  const addDrive = (drive: Omit<ContributionDrive, 'id' | 'contributions' | 'status' | 'expenses'>) => {
    setDrives((prev) => [
      { ...drive, id: `d${Date.now()}`, status: 'active', contributions: [], expenses: [] },
      ...prev,
    ])
    pushNotification({
      type: 'drive',
      title: drive.title,
      message: drive.description?.slice(0, 100) || drive.title,
      createdAt: new Date().toISOString().slice(0, 10),
      hofOnly: drive.hofOnly,
    })
  }

  const updateDrive = (id: string, updates: Partial<Omit<ContributionDrive, 'id' | 'contributions' | 'expenses'>>) =>
    setDrives((prev) => prev.map((d) => d.id === id ? { ...d, ...updates } : d))

  const toggleDriveStatus = (id: string) =>
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'active' ? 'closed' : 'active' } : d))
    )

  const confirmContribution = (driveId: string, contribId: string, confirmedBy: string) =>
    setDrives((prev) =>
      prev.map((d) =>
        d.id === driveId
          ? { ...d, contributions: d.contributions.map((c) => c.id === contribId ? { ...c, confirmed: true, confirmedBy } : c) }
          : d
      )
    )

  const toggleContributionConfirm = (driveId: string, contribId: string, confirmedBy: string) =>
    setDrives((prev) =>
      prev.map((d) =>
        d.id === driveId
          ? { ...d, contributions: d.contributions.map((c) => c.id === contribId ? { ...c, confirmed: !c.confirmed, confirmedBy: !c.confirmed ? confirmedBy : undefined } : c) }
          : d
      )
    )

  const recordContribution = (driveId: string, userId: string, userName: string, amount: number, confirmedBy: string) =>
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id !== driveId) return d
        const existing = d.contributions.find((c) => c.userId === userId && !c.confirmed)
        if (existing) {
          return { ...d, contributions: d.contributions.map((c) => c.id === existing.id ? { ...c, confirmed: true, confirmedBy } : c) }
        }
        return { ...d, contributions: [...d.contributions, { id: `c${Date.now()}`, userId, userName, amount, paidAt: new Date().toISOString().slice(0, 10), confirmed: true, confirmedBy }] }
      })
    )

  const removeContribution = (driveId: string, contribId: string) =>
    setDrives((prev) =>
      prev.map((d) =>
        d.id === driveId
          ? { ...d, contributions: d.contributions.filter((c) => c.id !== contribId) }
          : d
      )
    )

  const addExpense = (driveId: string, expense: Omit<Expense, 'id'>) =>
    setDrives((prev) =>
      prev.map((d) =>
        d.id === driveId
          ? { ...d, expenses: [...d.expenses, { ...expense, id: `ex${Date.now()}` }] }
          : d
      )
    )

  // ── Notifications ──────────────────────────────────────────────────────────
  const markNotificationRead = (notifId: string, userId: string) =>
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId && !n.readBy.includes(userId)
          ? { ...n, readBy: [...n.readBy, userId] }
          : n
      )
    )

  const markAllRead = (userId: string) =>
    setNotifications((prev) =>
      prev.map((n) =>
        n.readBy.includes(userId) ? n : { ...n, readBy: [...n.readBy, userId] }
      )
    )

  // ── Feedback ───────────────────────────────────────────────────────────────
  const addFeedback = (item: Omit<FeedbackItem, 'id' | 'status'>) =>
    setFeedback((prev) => [{ ...item, id: `fb${Date.now()}`, status: 'open' }, ...prev])

  const markFeedbackResolved = (id: string, byName: string) =>
    setFeedback((prev) => prev.map((f) => f.id === id
      ? { ...f, status: 'resolved', lastAction: 'resolved', lastActionBy: byName, lastActionAt: new Date().toISOString().slice(0, 10) }
      : f))

  const reopenFeedback = (id: string, byName: string) =>
    setFeedback((prev) => prev.map((f) => f.id === id
      ? { ...f, status: 'open', lastAction: 'reopened', lastActionBy: byName, lastActionAt: new Date().toISOString().slice(0, 10) }
      : f))

  const deleteFeedback = (id: string) =>
    setFeedback((prev) => prev.filter((f) => f.id !== id))

  // ── Marketplace ────────────────────────────────────────────────────────────
  const addListing = (listing: Omit<MarketplaceListing, 'id' | 'createdAt'>) =>
    setListings((prev) => [{ ...listing, id: `m${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }, ...prev])

  const deleteListing = (id: string) =>
    setListings((prev) => prev.filter((l) => l.id !== id))

  const pushExpiryNotification = (listing: MarketplaceListing) =>
    pushNotification({
      type: 'listing',
      title: 'Listing Expired',
      message: `Your listing "${listing.title}" has expired and been removed.`,
      createdAt: new Date().toISOString().slice(0, 10),
      targetUserId: listing.sellerId,
    })

  const toggleListingRead = (listingId: string, userId: string) =>
    setListings((prev) =>
      prev.map((l) => {
        if (l.id !== listingId) return l
        const readBy = l.readBy ?? []
        return readBy.includes(userId)
          ? { ...l, readBy: readBy.filter((id) => id !== userId) }
          : { ...l, readBy: [...readBy, userId] }
      })
    )

  // ── Social Media / Group Chats ─────────────────────────────────────────────
  const addChat = (chat: Omit<GroupChat, 'id'>) =>
    setChats((prev) => [...prev, { ...chat, id: `g${Date.now()}` }])

  const updateChat = (id: string, updates: Partial<Omit<GroupChat, 'id'>>) =>
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))

  const deleteChat = (id: string) =>
    setChats((prev) => prev.filter((c) => c.id !== id))

  // ── Exco ───────────────────────────────────────────────────────────────────
  const addExcoMember = (member: Omit<ExcoMember, 'id'>) =>
    setExcoMembers((prev) => [...prev, { ...member, id: `x${Date.now()}` }])

  const updateExcoMember = (id: string, updates: Partial<Omit<ExcoMember, 'id'>>) =>
    setExcoMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))

  const deleteExcoMember = (id: string) =>
    setExcoMembers((prev) => prev.filter((m) => m.id !== id))

  // ── Audit log ──────────────────────────────────────────────────────────────
  const cutoff = () => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d }
  const prune = (entries: AuditEntry[]) => entries.filter((e) => new Date(e.timestamp) >= cutoff())

  // Purge entries older than 3 months on mount
  useEffect(() => { setAuditLog((prev) => prune(prev)) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Polls ──────────────────────────────────────────────────────────────────
  const addPoll = (poll: Omit<Poll, 'id' | 'createdAt'>) =>
    setPolls((prev) => [{ ...poll, id: `poll${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }, ...prev])

  const updatePoll = (id: string, updates: Partial<Omit<Poll, 'id' | 'createdAt'>>) =>
    setPolls((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p))

  const deletePoll = (id: string) =>
    setPolls((prev) => prev.filter((p) => p.id !== id))

  const votePoll = (pollId: string, optionIds: string[], userId: string) =>
    setPolls((prev) => prev.map((p) => {
      if (p.id !== pollId) return p
      const cleared = p.options.map((o) => ({ ...o, votes: o.votes.filter((v) => v !== userId) }))
      return { ...p, options: cleared.map((o) => optionIds.includes(o.id) ? { ...o, votes: [...o.votes, userId] } : o) }
    }))

  const addAuditEntry = (activity: string, initiatedBy: string, category: AuditCategory) =>
    setAuditLog((prev) => [{
      id: `al${Date.now()}`,
      category,
      activity,
      initiatedBy,
      timestamp: new Date().toISOString(),
    }, ...prune(prev)])

  return (
    <DataContext.Provider value={{
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, addComment,
      events, addEvent, updateEvent, deleteEvent, updateRSVP,
      users, toggleHeadOfFamily, setUserRole, deleteUser, updateUserById,
      drives, addDrive, updateDrive, toggleDriveStatus, confirmContribution, toggleContributionConfirm, recordContribution, removeContribution, addExpense,
      notifications, markNotificationRead, markAllRead,
      feedback, addFeedback, markFeedbackResolved, reopenFeedback, deleteFeedback,
      listings, addListing, deleteListing, pushExpiryNotification, toggleListingRead,
      chats, addChat, updateChat, deleteChat,
      financeStats, setFinanceStats,
      excoMembers, excoTerm, setExcoTerm, addExcoMember, updateExcoMember, deleteExcoMember,
      auditLog, addAuditEntry,
      polls, addPoll, updatePoll, deletePoll, votePoll,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
