'use client'
import { useEffect, useRef, useState } from 'react'
import { randomLeaderMessageParts, LeaderMessageParts } from '../../lib/leader-messages'
import { TEST_CELEBRATION_EVENT } from '../../lib/celebration-events'

const POLL_MS = 30000 // how often to check for a new leader
// The video (public/videos/leader-change.mp4) itself is 15.17s — the video's
// own onEnded handler below is what normally closes the overlay right when
// it finishes. This is just a safety fallback in case the video fails to
// load/play, so it's set a beat past the real runtime, not the actual
// on-screen duration.
const CELEBRATION_MS = 16000
const STORAGE_KEY = 'callisto:lastLeader'

// Plays a full-screen video + a rotating hype line whenever the #1 team
// changes — polls /api/leader instead of needing a websocket, and only
// celebrates a CHANGE (never on first load, so it doesn't fire just
// because someone opened the app). Lives in the (app) layout, so it's
// active across every dashboard page.
export default function LeaderChangeCelebration() {
  const [celebration, setCelebration] = useState<({ teamCode: string } & LeaderMessageParts) | null>(null)
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
          setCelebration({ teamCode: data.teamCode, ...randomLeaderMessageParts() })
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
          hideTimerRef.current = setTimeout(() => setCelebration(null), CELEBRATION_MS)
        }
        knownLeaderRef.current = data.teamCode
        localStorage.setItem(STORAGE_KEY, data.teamCode)
      } catch {
        // Network hiccup — just try again next tick.
      }
    }

    // Admin's "Test celebration" button — plays it right now with whoever
    // the real current leader is, skipping the wait for a real change.
    async function testTrigger() {
      try {
        const res = await fetch('/api/leader', { cache: 'no-store' })
        const data: { teamCode: string | null } = await res.json()
        const teamCode = data.teamCode ?? 'YOUR TEAM'
        setCelebration({ teamCode, ...randomLeaderMessageParts() })
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        hideTimerRef.current = setTimeout(() => setCelebration(null), CELEBRATION_MS)
      } catch {
        setCelebration({ teamCode: 'YOUR TEAM', ...randomLeaderMessageParts() })
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        hideTimerRef.current = setTimeout(() => setCelebration(null), CELEBRATION_MS)
      }
    }

    poll()
    const id = setInterval(poll, POLL_MS)
    window.addEventListener(TEST_CELEBRATION_EVENT, testTrigger)
    return () => {
      clearInterval(id)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      window.removeEventListener(TEST_CELEBRATION_EVENT, testTrigger)
    }
  }, [])

  if (!celebration) return null

  return (
    <div className="fixed inset-0 z-[2000] bg-black">
      <video
        key={celebration.teamCode}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/leader-change.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setCelebration(null)}
      />
      <div className="absolute inset-0 ring-[6px] ring-inset ring-yellow shadow-[inset_0_0_120px_-20px_rgba(255,212,0,0.9)]" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-8 sm:p-12 pt-32">
        <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-widest bg-yellow text-black mb-4 animate-liveBadge">NEW LEADER</div>
        <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold italic text-white leading-tight max-w-6xl">
          {celebration.before}
          <span className="shimmer-text">{celebration.teamCode}</span>
          {celebration.after}
        </div>
      </div>
    </div>
  )
}
