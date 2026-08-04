import React from 'react'
import LiveLeaderboard from '../components/leaderboard/LiveLeaderboard'
import HeroPanel from '../components/hero/HeroPanel'
import RouteOverview from '../components/stage/RouteOverview'
import StageSummary from '../components/stage/StageSummary'
import { getLeaderboard } from '../lib/data-source'

export default async function Home() {
  const leaderboard = await getLeaderboard()
  const leader = leaderboard[0]
  return (
    <div className="space-y-6">
      <HeroPanel />
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 xl:col-span-8">
          <div className="rounded-lg p-6 app-surface">
            <h2 className="text-2xl font-bold">LIVE LEADERBOARD</h2>
            <LiveLeaderboard entries={leaderboard} />
          </div>
        </section>
        <aside className="col-span-12 xl:col-span-4 space-y-6">
          <RouteOverview />
          <StageSummary />
          <div className="rounded-lg p-6 app-surface">
            <h3 className="font-semibold">CURRENT LEADER</h3>
            {leader ? (
              <div className="mt-4">
                <div className="text-4xl font-bold">#1 — {leader.teamCode}</div>
                <div className="mt-2 text-secondaryText">{leader.countryName} • Lap {leader.lap}</div>
                <div className="mt-4 text-yellow font-bold">{leader.totalDistance.toLocaleString()} km</div>
              </div>
            ) : (
              <div>No leader</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
