import React from 'react'

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border bg-surface gap-4">
      <div className="flex items-center gap-3">
        <img src="/images/Callisto%20Icon.png" alt="Callisto" className="w-12 h-12 object-contain shrink-0" />
        <div>
          <div className="text-xl font-bold italic">TOUR DE <span className="shimmer-text">CALLISTO</span></div>
          <div className="text-sm text-secondaryText">AUGUST 2026 EDITION</div>
        </div>
        <img src="/images/Bicycle-transparent.png" alt="" className="w-10 h-10 object-contain shrink-0 ml-1" />
      </div>
      <div className="flex items-center gap-4 text-secondaryText text-sm">
        <div>20 AUG 2026</div>
        <div>12:34</div>
      </div>
    </header>
  )
}
