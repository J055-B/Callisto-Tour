import React from 'react'

export default function RouteOverview() {
  return (
    <div className="rounded-lg p-5 app-surface mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondaryText">Route Overview</p>
          <h3 className="text-lg font-semibold">Mont Blanc Alpine</h3>
        </div>
        <button className="w-9 h-9 rounded-full border border-border text-secondaryText hover:bg-yellow/10 transition">
          ▶
        </button>
      </div>
      <div className="h-36 mb-4 rounded-xl bg-black/30 overflow-hidden">
        <div className="relative h-full w-full">
          <div className="absolute left-4 top-4 w-3 h-3 rounded-full bg-green-500 shadow-glow" />
          <div className="absolute right-4 top-4 w-3 h-3 rounded-full bg-red-500 shadow-glow" />
          <div className="absolute inset-x-4 bottom-10 h-1 rounded-full bg-white/10" />
          <div className="absolute inset-x-4 top-16 h-1 rounded-full bg-yellow" style={{ clipPath: 'polygon(0% 50%, 10% 45%, 20% 55%, 30% 35%, 40% 50%, 50% 40%, 60% 60%, 70% 45%, 80% 55%, 90% 35%, 100% 50%)' }} />
        </div>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 text-sm text-secondaryText">
          <div className="rounded-xl bg-black/30 p-4">
            <div className="text-[10px] uppercase tracking-[0.24em] mb-2">Total Distance</div>
            <div className="text-lg font-semibold">16,700 km</div>
          </div>
          <div className="rounded-xl bg-black/30 p-4">
            <div className="text-[10px] uppercase tracking-[0.24em] mb-2">Completed</div>
            <div className="text-lg font-semibold text-green-400">8,742 km</div>
            <div className="text-xs text-secondaryText">(52.3%)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
