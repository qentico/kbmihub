'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Lang, t } from './translations'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  tr: typeof t['en']
}

const LangContext = createContext<LangContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('kbmi_lang') as Lang | null
    if (stored === 'en' || stored === 'ms') setLangState(stored)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('kbmi_lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, tr: t[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
