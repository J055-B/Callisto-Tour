'use client'
import React, { useEffect, useRef, useState } from 'react'
import { randomLeaderMessage } from '../../lib/leader-messages'

const POLL_MS = 30000 // how often to check for a new leader
const CELEBRATION_MS = 8000 // how long the overlay stays up
const STORAGE_KEY = 'callisto:lastLeader'

// Plays a full-screen video + a rotating hype line whenever the #1 team
// changes — polls /api/leader instead of needing a websocket, and only
// celebrates a CHANGE (never on first load, so it doesn't fire just
// because someone opened the app). Lives in the (app) layout, so it's
// active across every dashboard page.
export default function LeaderChangeCelebration() {
  const [celebration, setCelebration] = useState<{ teamCode: string; message: string } | null>(null)
  const knownLeaderRef = useRef<string | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    knownLeaderRef.current = localStorage.getItem(STORAGE_KEY)

    async function poll() {
      try {
        const res = await fetch('/api/leader', { cache: 'no-store' })
        if (!res.ok) return
        const data: { teamCode: string | null } = await res.json()
        if (!data.teamCode) return

        const previous = knownLeaderRef.current
        if (previous !== null && previous !== data.teamCode) {
          setCelebration({ teamCode: data.teamCode, message: randomLeaderMessage(data.teamCode) })
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
          hideTimerRef.current = setTimeout(() => setCelebration(null), CELEBRATION_MS)
        }
        knownLeaderRef.current = data.teamCode
        localStorage.setItem(STORAGE_KEY, data.teamCode)
      } catch {
        // Network hiccup — just try again next tick.
      }
    }

    poll()
    const id = setInterval(poll, POLL_MS)
    return () => {
      clearInterval(id)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  if (!celebration) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 rounded-xl overflow-hidden border border-yellow shadow-[0_0_60px_-10px_rgba(255,212,0,0.6)]">
        <video
          key={celebration.teamCode}
          className="w-full h-auto block"
          src="/videos/leader-change.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setCelebration(null)}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-16">
          <div className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-yellow text-black mb-2">NEW LEADER</div>
          <div className="text-2xl sm:text-3xl font-extrabold italic text-white leading-tight">{celebration.message}</div>
        </div>
      </div>
    </div>
  )
}
