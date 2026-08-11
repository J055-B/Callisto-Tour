'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getRole, ROLE_CHANGED_EVENT, ADMIN_USER, ADMIN_PASS } from '../../lib/session'
import { SiteContent, DEFAULT_CONTENT } from '../../lib/site-content'

interface Ctx {
  content: SiteContent
  isAdmin: boolean
  updateContent: (key: string, value: string) => Promise<void>
}

const SiteContentContext = createContext<Ctx>({
  content: DEFAULT_CONTENT,
  isAdmin: false,
  updateContent: async () => {}
})

export function useSiteContent() {
  return useContext(SiteContentContext)
}

// Fetches the shared content server-side once per page load (see
// app/layout.tsx) and hands it down here — every visitor starts from the
// same values. Admin edits update this client-side copy optimistically
// (instant feedback) and persist to Vercel Blob via /api/content; a failed
// save rolls the local copy back so the UI never lies about what's
// actually saved.
export default function SiteContentProvider({ initialContent, children }: { initialContent: SiteContent; children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const read = () => setIsAdmin(getRole() === 'admin')
    read()
    window.addEventListener(ROLE_CHANGED_EVENT, read)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener(ROLE_CHANGED_EVENT, read)
      window.removeEventListener('storage', read)
    }
  }, [])

  async function updateContent(key: string, value: string) {
    const previous = content[key]
    setContent((c) => ({ ...c, [key]: value }))
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS, updates: { [key]: value } })
      })
      if (!res.ok) throw new Error('save failed')
      const saved = (await res.json()) as SiteContent
      setContent(saved)
    } catch (err) {
      setContent((c) => ({ ...c, [key]: previous }))
      throw err
    }
  }

  return <SiteContentContext.Provider value={{ content, isAdmin, updateContent }}>{children}</SiteContentContext.Provider>
}
