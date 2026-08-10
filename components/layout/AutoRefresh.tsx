'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

// Re-fetches the live Sheet data every minute so numbers stay correct even
// if someone leaves a tab open all day without ever touching it — without
// a jarring full-page reload. router.refresh() re-runs the Server
// Components (getLeaderboard, getTeams, etc.) in place; a true hard reload
// would do the same for the data, but would ALSO cut the music off mid-song
// (and require a fresh click to resume it — autoplay policy), interrupt the
// leader-change celebration video if one's playing, and restart
// MonitorMode's TV-mode cycle from the top every single minute. This gets
// the fresh numbers without any of that.
export default function AutoRefresh() {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh()
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [router])

  return null
}
