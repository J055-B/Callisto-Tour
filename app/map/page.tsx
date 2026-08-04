import React from 'react'
import { getRoute, getLeaderboard } from '../../lib/data-source'

export default async function MapPage() {
  const route = await getRoute()
  const leaderboard = await getLeaderboard()
  const leader = leaderboard[0]
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Route</h1>
      <div className="app-surface rounded-lg p-4">
        <div className="h-96 bg-black/40 rounded flex items-center justify-center">Map placeholder — route with {route.length} points</div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-elevated rounded">
            <div className="text-xs text-secondaryText">TOTAL ROUTE</div>
            <div className="font-bold mt-1">16,696 KM</div>
          </div>
          <div className="p-3 bg-elevated rounded">
            <div className="text-xs text-secondaryText">LEADER DISTANCE</div>
            <div className="font-bold mt-1">{leader ? Math.round(leader.totalDistance).toLocaleString() + ' KM' : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
