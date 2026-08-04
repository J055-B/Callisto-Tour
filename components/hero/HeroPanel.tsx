"use client"
import React from 'react'

export default function HeroPanel() {
  const hasImage = false
  return (
    <div className="rounded-lg overflow-hidden relative h-56 app-surface">
      {hasImage ? (
        <img src="/images/cycling-hero.jpg" alt="Cycling hero" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-black/80 via-surface to-transparent flex items-center p-6">
          <div>
            <div className="inline-block bg-positive text-black px-3 py-1 rounded-full text-xs font-bold">LIVE NOW</div>
            <h3 className="text-2xl font-bold mt-3">STAGE 12 • MONT BLANC ALPINE</h3>
            <div className="text-sm text-secondaryText mt-1">20 AUG 2026 — DAY 12 OF 22 — FRANCE</div>
            <div className="mt-4">
              <div className="text-xs text-secondaryText">STAGE PROGRESS</div>
              <div className="w-72 h-3 bg-border rounded mt-1">
                <div className="h-3 bg-yellow rounded" style={{ width: '84.2%' }} />
              </div>
              <div className="text-sm text-yellow font-bold mt-1">84.2%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
