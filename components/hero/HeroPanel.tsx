"use client"
import React from 'react'
import { LeaderboardEntry } from '../../lib/types'
import { videoUrlForDistance } from '../../lib/city-videos'
import { flagUrl } from '../../lib/flags'
import { tourDayInfo } from '../../lib/calculations'
import { MILESTONE_STAGES, milestonePositionForDistance } from '../../lib/milestones'

export default function HeroPanel({ teams }: { teams: LeaderboardEntry[] }) {
  if (teams.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden app-surface h-60 flex items-center justify-center text-secondaryText">
        TOUR DE CALLISTO
      </div>
    )
  }

  const leader = teams[0]
  const last = teams[teams.length - 1]
  const { stageIndex, fraction } = milestonePositionForDistance(leader.totalDistance)
  const stage = MILESTONE_STAGES[stageIndex - 1]
  const nextIndex = stageIndex === MILESTONE_STAGES.length ? 1 : stageIndex + 1
  const nextStage = MILESTONE_STAGES[nextIndex - 1]
  const lastStageIndex = milestonePositionForDistance(last.totalDistance).stageIndex
  const { day, totalDays } = tourDayInfo()
  const videoUrl = videoUrlForDistance(leader.totalDistance)
  const flag = flagUrl(leader.countryCode)
  // "Sofia → Nis" -> "Sofia" — the departure city of the leader's current leg.
  const cityName = leader.currentStage?.split('→')[0]?.trim() || leader.countryName
  const progressPct = fraction * 100
  const showSideColumns = teams.length > 1

  return (
    <div className="rounded-lg overflow-hidden relative h-60 app-surface">
      <video key={videoUrl} className="absolute inset-0 w-full h-full object-cover" src={videoUrl} autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />

      {/* LAST → LEADER → NEXT STAGE, left to right — LEADER stays the visual
          centerpiece, LAST/NEXT flank it as slimmer columns. */}
      <div className="relative h-full flex items-stretch">
        {showSideColumns && (
          <div className="hidden sm:flex flex-col justify-center shrink-0 w-36 px-5 border-r border-white/10">
            <div className="text-[10px] font-bold tracking-widest text-secondaryText">LAST</div>
            <div className="text-base font-bold mt-1 truncate">{last.teamCode}</div>
            <div className="text-xs text-secondaryText mt-1">Stage {lastStageIndex}</div>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between p-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-positive via-[#7be04a] to-positive bg-[length:250%_100%] animate-liveBadge text-black px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-liveDot" />
              LIVE NOW
            </div>

            <div className="mt-3 leading-none flex items-center flex-wrap gap-x-3 gap-y-1.5">
              <span>
                <span className="text-4xl font-bold">STAGE </span>
                <span className="text-4xl font-bold text-yellow">{stage.index}</span>
              </span>
              {stage.isPowerStage && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-electric/20 text-electric border border-electric/50">
                  {stage.powerLabel}
                </span>
              )}
            </div>
            <div className="mt-1.5 text-base font-semibold tracking-wide">{(leader.currentStage || stage.label).toUpperCase()}</div>

            <div className="mt-3 flex items-center gap-2 text-sm text-secondaryText flex-wrap">
              <span className="text-yellow font-bold">LEADER: {leader.teamCode}</span>
              <span>·</span>
              <span>
                DAY {day} of {totalDays}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                {flag && <img src={flag} alt="" className="w-4 h-2.5 rounded-sm object-cover" />}
                {cityName}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-secondaryText tracking-widest">STAGE PROGRESS</span>
              <span className="text-sm text-positive font-bold">{progressPct.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-positive rounded-full" style={{ width: `${Math.min(100, progressPct).toFixed(1)}%` }} />
              </div>
              <span className="text-xs text-secondaryText whitespace-nowrap">{stage.widthKm.toLocaleString()} KM</span>
            </div>
          </div>
        </div>

        {showSideColumns && (
          <div className="hidden sm:flex flex-col justify-center shrink-0 w-44 px-5 border-l border-white/10 text-right">
            <div className="text-[10px] font-bold tracking-widest text-electric">NEXT STAGE {nextStage.index}</div>
            <div className="text-sm font-bold mt-1">{nextStage.label.toUpperCase()}</div>
          </div>
        )}
      </div>
    </div>
  )
}
