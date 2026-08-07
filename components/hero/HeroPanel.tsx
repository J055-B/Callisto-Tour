"use client"
import React from 'react'
import { LeaderboardEntry } from '../../lib/types'
import { videoUrlForDistance } from '../../lib/city-videos'
import { nextStageForDistance } from '../../data/route'

interface HeroCardData {
  badge: string
  badgeClass: string
  title: string
  subtitle: string
  videoUrl: string
  progress?: number
}

function HeroCard({ data }: { data: HeroCardData }) {
  return (
    <div className="relative flex-1 min-w-0 min-h-0 overflow-hidden">
      <video
        key={data.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        src={data.videoUrl}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 flex flex-col justify-end p-4">
        <div className={`inline-block self-start px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${data.badgeClass}`}>
          {data.badge}
        </div>
        <h4 className="text-base font-bold mt-2 leading-tight truncate">{data.title}</h4>
        <div className="text-xs text-secondaryText mt-0.5 truncate">{data.subtitle}</div>
        {data.progress !== undefined && (
          <div className="mt-3">
            <div className="w-full h-2 bg-white/15 rounded">
              <div className="h-2 bg-yellow rounded" style={{ width: `${Math.min(100, data.progress).toFixed(1)}%` }} />
            </div>
            <div className="text-xs text-yellow font-bold mt-1">{data.progress.toFixed(1)}%</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HeroPanel({ teams }: { teams: LeaderboardEntry[] }) {
  if (teams.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden app-surface h-56 flex items-center justify-center text-secondaryText">
        TOUR DE CALLISTO
      </div>
    )
  }

  const leader = teams[0]
  const last = teams[teams.length - 1]
  const next = nextStageForDistance(leader.totalDistance)

  const cards: HeroCardData[] = [
    {
      badge: 'LAST PLACE',
      badgeClass: 'bg-elevated text-secondaryText border border-border',
      title: last.teamCode,
      subtitle: last.currentStage ? last.currentStage.toUpperCase() : 'LIVE ROUTE',
      videoUrl: videoUrlForDistance(last.totalDistance)
    },
    {
      badge: 'LIVE NOW — LEADER',
      badgeClass: 'bg-positive text-black',
      title: leader.teamCode,
      subtitle: leader.currentStage ? leader.currentStage.toUpperCase() : 'LIVE ROUTE',
      videoUrl: videoUrlForDistance(leader.totalDistance),
      progress: leader.targetPct
    },
    {
      badge: 'NEXT STAGE',
      badgeClass: 'bg-electric/20 text-electric border border-electric/50',
      title: next.stageLabel.toUpperCase(),
      subtitle: "COMING UP ON THE LEADER'S ROUTE",
      videoUrl: videoUrlForDistance(next.cumulativeKm)
    }
  ]

  return (
    <div className="rounded-lg overflow-hidden app-surface">
      <div className="flex flex-col sm:flex-row h-[420px] sm:h-56 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {cards.map((c, i) => (
          <HeroCard key={i} data={c} />
        ))}
      </div>
    </div>
  )
}
