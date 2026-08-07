import React from 'react'
import { getLeaderboard } from '../../lib/data-source'
import DetailedLeaderboard from '../../components/leaderboard/DetailedLeaderboard'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const entries = await getLeaderboard()
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="app-surface rounded-lg p-4">
        <DetailedLeaderboard entries={entries} />
      </div>
    </div>
  )
}
