'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { MOCK_USERS, User } from './mock-data'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (name: string, email: string, password: string, dob?: string, phone?: string) => Promise<{ error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('kbmi_user')
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored)
        // Re-hydrate role from canonical source so localStorage tampering is ineffective
        const canonical = MOCK_USERS.find((u) => u.id === parsed.id)
        if (canonical) {
          setUser({ ...parsed, role: canonical.role })
        } else {
          // Newly signed-up users are always members
          setUser({ ...parsed, role: 'member' })
        }
      } catch {
        localStorage.removeItem('kbmi_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found) return { error: 'No account found with this email.' }
    setUser(found)
    localStorage.setItem('kbmi_user', JSON.stringify(found))
    return {}
  }

  const signup = async (name: string, email: string, _password: string, dob?: string, phone?: string) => {
    const exists = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) return { error: 'An account with this email already exists.' }
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: 'member',
      branch: 'Cawangan Baru',
      avatar: name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      joinedAt: new Date().toISOString().slice(0, 10),
      totalContributed: 0,
      ...(dob && { dob }),
      ...(phone && { phone }),
    }
    setUser(newUser)
    localStorage.setItem('kbmi_user', JSON.stringify(newUser))
    return {}
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('kbmi_user')
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem('kbmi_user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
