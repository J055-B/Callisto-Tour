import React from 'react'

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border bg-surface gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-yellow flex items-center justify-center text-black font-bold text-xl">
          C
        </div>
        <div>
          <div className="text-xl font-bold">TOUR DE <span className="text-yellow">CALLISTO</span></div>
          <div className="text-sm text-secondaryText">AUGUST 2026 EDITION</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-secondaryText text-sm">
        <div>20 AUG 2026</div>
        <div>12:34</div>
      </div>
    </header>
  )
}
