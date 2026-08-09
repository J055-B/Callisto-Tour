import { NextResponse } from 'next/server'
import { getLeaderboard } from '../../../lib/data-source'

export const dynamic = 'force-dynamic'

// Polled by LeaderChangeCelebration.tsx to detect when the #1 team changes,
// without the person having to refresh the page. Just the current leader's
// code — the rest of the leaderboard already loads normally per-page.
export async function GET() {
  const leaderboard = await getLeaderboard()
  const leader = leaderboard[0]
  return NextResponse.json({ teamCode: leader?.teamCode ?? null })
}
