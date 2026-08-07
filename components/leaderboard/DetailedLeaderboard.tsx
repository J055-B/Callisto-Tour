"use client"
import React from 'react'
import { Trophy } from 'lucide-react'
import { LeaderboardEntry } from '../../lib/types'
import { flagUrl } from '../../lib/flags'
import { weeklyTargetForToday } from '../../lib/calculations'
import { LOOP_KM } from '../../data/route'

const MEDAL_COLOR: Record<number, string> = {
  1: '#FFD700', // gold
  2: '#C0C0C0', // silver
  3: '#CD7F32' // bronze
}

const RED: [number, number, number] = [255, 69, 58]
const GREEN: [number, number, number] = [86, 217, 43]
const TURQUOISE = '#2DD4BF'

function progressColor(pct: number, allowOverflow: boolean) {
  if (allowOverflow && pct > 100) return TURQUOISE
  const t = Math.max(0, Math.min(90, pct)) / 90
  const rgb = RED.map((c, i) => Math.round(c + (GREEN[i] - c) * t))
  return `rgb(${rgb.join(',')})`
}

// One column wider than the home page's LiveLeaderboard: adds "% OF
// TARGET" (today's target%) and "% OF JOURNEY" (progress around the whole
// 17,250km loop) — this page-specific view only, per the Aug 2026 ask.
const GRID_COLS = '56px 1.2fr 1fr 0.85fr 1.3fr 0.9fr 0.85fr 0.9fr 0.8fr 1fr 0.6fr'

// Team Targets table below — fewer columns, so its own template.
const TARGETS_GRID_COLS = '56px 1.3fr 0.7fr 1fr 1fr 1fr'

function journeyPctFor(totalDistance: number) {
  const wrapped = ((totalDistance % LOOP_KM) + LOOP_KM) % LOOP_KM
  return (wrapped / LOOP_KM) * 100
}

function Position({ pos }: { pos: number }) {
  const color = MEDAL_COLOR[pos]
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-4 shrink-0 flex items-center justify-center">{color && <Trophy size={16} color={color} fill={color} />}</span>
      <span className="font-bold">{pos}</span>
    </span>
  )
}

export default function DetailedLeaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="space-y-6">
      {/* Extended table — % OF TARGET and % OF JOURNEY columns added */}
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid gap-4 px-4 pb-1 text-xs font-bold uppercase tracking-wider text-secondaryText" style={{ gridTemplateColumns: GRID_COLS }}>
            <div>POS</div>
            <div>TEAM</div>
            <div>CURRENT KM</div>
            <div>% OF JOURNEY</div>
            <div>ROUTE TARGET</div>
            <div>TODAY</div>
            <div>% OF TARGET</div>
            <div>DISTANCE</div>
            <div>GAP</div>
            <div>COUNTRY</div>
            <div>LAP</div>
          </div>
          <div className="mt-3 space-y-2">
            {entries.map((e, i) => {
              const pos = i + 1
              const flag = flagUrl(e.countryCode)
              const isLeader = pos === 1
              const journeyPct = journeyPctFor(e.totalDistance)
              return (
                <div
                  key={e.id}
                  className={
                    'grid items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors ' +
                    (isLeader
                      ? 'bg-gradient-to-r from-yellow/25 via-yellow/10 to-transparent border border-yellow shadow-[0_0_20px_-6px_rgba(255,212,0,0.6)]'
                      : 'bg-elevated/60 border border-border')
                  }
                  style={{ gridTemplateColumns: GRID_COLS }}
                >
                  <div>
                    <Position pos={pos} />
                  </div>
                  <div className="font-medium">{e.teamCode}</div>
                  <div>{Math.round(e.totalDistance).toLocaleString()} km</div>
                  <div className="font-semibold" style={{ color: progressColor(journeyPct, false) }}>
                    {journeyPct.toFixed(1)}%
                  </div>
                  <div className="text-secondaryText">{e.currentStage || '—'}</div>
                  <div className="font-semibold" style={{ color: progressColor(e.targetPct, true) }}>
                    {Math.round(e.kmToday)} km
                  </div>
                  <div className="font-semibold" style={{ color: progressColor(e.targetPct, true) }}>
                    {e.targetPct.toFixed(1)}%
                  </div>
                  <div className="font-semibold" style={{ color: progressColor(e.legProgressPct, false) }}>
                    {Math.round(e.kmToNextWaypoint).toLocaleString()} km
                  </div>
                  <div>
                    {e.gap === 0 ? <span className="text-secondaryText">—</span> : <span className="text-negative font-semibold">-{Math.abs(e.gap)} km</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {flag && <img src={flag} alt="" className="w-5 h-3.5 rounded-sm object-cover border border-border" />}
                    {e.countryCode}
                  </div>
                  <div>{e.lap}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Per-team target table — same row/column style as the leaderboard above */}
      <div>
        <h3 className="text-base font-semibold mb-3">Team Targets</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid gap-4 px-4 pb-1 text-xs font-bold uppercase tracking-wider text-secondaryText" style={{ gridTemplateColumns: TARGETS_GRID_COLS }}>
              <div>POS</div>
              <div>TEAM</div>
              <div>POOL</div>
              <div>DAILY TARGET</div>
              <div>% OF TARGET</div>
              <div>WEEKLY TARGET</div>
            </div>
            <div className="mt-3 space-y-2">
              {entries.map((e, i) => {
                const pos = i + 1
                const isLeader = pos === 1
                const weeklyTarget = weeklyTargetForToday(e.dailyTarget)
                return (
                  <div
                    key={e.id}
                    className={
                      'grid items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors ' +
                      (isLeader
                        ? 'bg-gradient-to-r from-yellow/25 via-yellow/10 to-transparent border border-yellow shadow-[0_0_20px_-6px_rgba(255,212,0,0.6)]'
                        : 'bg-elevated/60 border border-border')
                    }
                    style={{ gridTemplateColumns: TARGETS_GRID_COLS }}
                  >
                    <div>
                      <Position pos={pos} />
                    </div>
                    <div className="font-medium">{e.teamCode}</div>
                    <div className="text-secondaryText">{e.pool}</div>
                    <div>{e.dailyTarget.toLocaleString()}</div>
                    <div className="font-semibold" style={{ color: progressColor(e.targetPct, true) }}>
                      {e.targetPct.toFixed(1)}%
                    </div>
                    <div>{weeklyTarget.toLocaleString()}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
