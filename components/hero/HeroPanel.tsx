"use client"
import React from 'react'
import { LeaderboardEntry } from '../../lib/types'
import { videoUrlForDistance } from '../../lib/city-videos'

export default function HeroPanel({ leader }: { leader?: LeaderboardEntry }) {
  const progress = leader?.targetPct ?? 0
  const stageLabel = leader?.currentStage ? leader.currentStage.toUpperCase() : 'LIVE ROUTE'
  const title = leader?.teamCode ? `#1 — ${leader.teamCode}` : 'TOUR DE CALLISTO'
  const videoUrl = videoUrlForDistance(leader?.totalDistance ?? 0)

  return (
    <div className="rounded-lg overflow-hidden relative h-56 app-surface">
      {/* key forces a remount (and reload) when the leader moves on to a new city's clip */}
      <video key={videoUrl} className="absolute inset-0 w-full h-full object-cover" src={videoUrl} autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 flex items-center p-6">
        <div>
          <div className="inline-block bg-positive text-black px-3 py-1 rounded-full text-xs font-bold">LIVE NOW</div>
          <h3 className="text-2xl font-bold mt-3">{title}</h3>
          <div className="text-sm text-secondaryText mt-1">{stageLabel}</div>
          <div className="mt-4">
            <div className="text-xs text-secondaryText">STAGE PROGRESS</div>
            <div className="w-72 h-3 bg-border rounded mt-1">
              <div className="h-3 bg-yellow rounded" style={{ width: `${Math.min(100, progress).toFixed(1)}%` }} />
            </div>
            <div className="text-sm text-yellow font-bold mt-1">{progress.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
