import React from 'react'

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-surface">
      <div>
        <div className="text-xl font-bold">TOUR DE <span className="text-yellow">CALLISTO</span></div>
        <div className="text-sm text-secondaryText">AUGUST 2026 EDITION</div>
      </div>
      <div className="flex items-center gap-4 text-secondaryText">
        <div>20 AUG 2026</div>
        <div>12:34</div>
      </div>
    </header>
  )
}
