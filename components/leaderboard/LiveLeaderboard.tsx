"use client"
import React from 'react'
import { LeaderboardEntry } from '../../lib/types'

export default function LiveLeaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-sm text-secondaryText">
            <th className="pr-4">POS</th>
            <th className="pr-4">TEAM</th>
            <th className="pr-4">SALES TODAY</th>
            <th className="pr-4">DAILY TARGET</th>
            <th className="pr-4">% OF TARGET</th>
            <th className="pr-4">KM TODAY</th>
            <th className="pr-4">TOTAL DISTANCE</th>
            <th className="pr-4">GAP</th>
            <th className="pr-4">COUNTRY</th>
            <th className="pr-4">LAP</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.id} className={`border-t border-border py-2 ${i === 0 ? 'ring-2 ring-yellow/30' : ''}`}>
              <td className="py-3 pr-4">{i + 1}</td>
              <td className="py-3 pr-4">{e.teamCode}</td>
              <td className="py-3 pr-4">${e.salesToday.toLocaleString()}</td>
              <td className="py-3 pr-4">${e.dailyTarget.toLocaleString()}</td>
              <td className="py-3 pr-4">{e.targetPct.toFixed(1)}%</td>
              <td className="py-3 pr-4">{Math.round(e.kmToday)} km</td>
              <td className="py-3 pr-4">{Math.round(e.totalDistance).toLocaleString()} km</td>
              <td className="py-3 pr-4">{e.gap === 0 ? '—' : `-${Math.abs(e.gap)} km`}</td>
              <td className="py-3 pr-4">{e.countryCode}</td>
              <td className="py-3 pr-4">{e.lap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
