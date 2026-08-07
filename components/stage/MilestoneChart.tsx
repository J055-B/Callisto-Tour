"use client"
import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LeaderboardEntry } from '../../lib/types'
import { MILESTONE_STAGES, milestonePositionForDistance } from '../../lib/milestones'

const TICK_STEP = 250 // km — divides evenly into every stage width (1000, 1500, and 1250)

interface TeamPosition {
  team: LeaderboardEntry
  stageIndex: number
  fraction: number
}

export default function MilestoneChart({ teams }: { teams: LeaderboardEntry[] }) {
  const positions: TeamPosition[] = useMemo(
    () => teams.map((team) => ({ team, ...milestonePositionForDistance(team.totalDistance) })),
    [teams]
  )

  // Opens on the leader's current stage (teams[] arrives sorted by distance).
  const [activeIndex, setActiveIndex] = useState(positions[0]?.stageIndex ?? 1)
  const stage = MILESTONE_STAGES[activeIndex - 1]

  const onThisStage = positions.filter((p) => p.stageIndex === activeIndex)
  const behind = positions.filter((p) => p.stageIndex < activeIndex)
  const ahead = positions.filter((p) => p.stageIndex > activeIndex)

  const goPrev = () => setActiveIndex((i) => (i === 1 ? MILESTONE_STAGES.length : i - 1))
  const goNext = () => setActiveIndex((i) => (i === MILESTONE_STAGES.length ? 1 : i + 1))

  const ticks: number[] = []
  for (let km = 0; km <= stage.widthKm; km += TICK_STEP) ticks.push(km)
  if (ticks[ticks.length - 1] !== stage.widthKm) ticks.push(stage.widthKm)

  return (
    <div className="rounded-lg p-4 app-surface">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondaryText">Daily Milestone</p>
          <h3 className="text-lg font-bold mt-0.5">
            STAGE {stage.index} — {stage.label.toUpperCase()}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {stage.isPowerStage && (
            <div className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-electric/20 text-electric border border-electric/50">
              {stage.powerLabel}
            </div>
          )}
          <div className="text-sm font-bold text-secondaryText">{stage.widthKm.toLocaleString()} KM</div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <NavArrow direction="prev" onClick={goPrev} positions={behind} />

        <div className="flex-1 min-w-0">
          {/* The flat bar */}
          <div className="relative h-16">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-electric/70" />

            {stage.points.map((p, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${p.fraction * 100}%` }}
                title={p.name}
              >
                <div className="w-2 h-2 rounded-full bg-page border border-secondaryText" />
              </div>
            ))}

            {onThisStage.map(({ team, fraction }) => (
              <div
                key={team.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                style={{ left: `${fraction * 100}%` }}
                title={`${team.teamCode} — ${Math.round(team.totalDistance).toLocaleString()} km`}
              >
                <div className="px-1.5 py-0.5 rounded-full bg-elevated border border-yellow text-[9px] font-bold whitespace-nowrap shadow-[0_0_6px_-1px_rgba(255,212,0,0.7)]">
                  {team.teamCode}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow mt-0.5" />
              </div>
            ))}
          </div>

          {/* Distance axis + inner point city labels */}
          <div className="relative h-10 mt-1 border-t border-border pt-1.5">
            {ticks.map((km) => (
              <div
                key={km}
                className="absolute top-1.5 -translate-x-1/2 text-[10px] text-secondaryText"
                style={{ left: `${(km / stage.widthKm) * 100}%` }}
              >
                {km.toLocaleString()}
              </div>
            ))}
            {stage.points.map((p, i) => (
              <div
                key={i}
                className="absolute top-6 -translate-x-1/2 text-[10px] text-secondaryText/70 whitespace-nowrap"
                style={{ left: `${p.fraction * 100}%` }}
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>

        <NavArrow direction="next" onClick={goNext} positions={ahead} />
      </div>
    </div>
  )
}

function NavArrow({
  direction,
  onClick,
  positions
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  positions: TeamPosition[]
}) {
  const MAX = 3
  const codes = positions.map((p) => p.team.teamCode)
  const shown = codes.slice(0, MAX)
  const extra = codes.length - shown.length

  return (
    <div className={`shrink-0 flex flex-col items-center gap-1.5 w-24 ${direction === 'next' ? 'items-end' : 'items-start'}`}>
      <button
        onClick={onClick}
        className="w-9 h-9 rounded-full border border-border text-secondaryText hover:bg-yellow/10 hover:text-yellow transition flex items-center justify-center"
        aria-label={direction === 'prev' ? 'Previous stage' : 'Next stage'}
      >
        {direction === 'prev' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
      {positions.length > 0 && (
        <div className={`flex flex-col gap-1 ${direction === 'next' ? 'items-end' : 'items-start'}`}>
          <span className="text-[9px] font-bold text-secondaryText tracking-wide">
            {direction === 'prev' ? 'BEHIND' : 'AHEAD'} ({positions.length})
          </span>
          <div className={`flex flex-wrap gap-1 ${direction === 'next' ? 'justify-end' : ''}`}>
            {shown.map((c) => (
              <span key={c} className="px-1.5 py-0.5 rounded-full bg-elevated border border-border text-[9px] text-secondaryText whitespace-nowrap">
                {c}
              </span>
            ))}
            {extra > 0 && <span className="text-[9px] text-secondaryText">+{extra}</span>}
          </div>
        </div>
      )}
    </div>
  )
}
