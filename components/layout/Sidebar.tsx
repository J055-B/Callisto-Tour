import React from 'react'
import Link from 'next/link'

const items = [
  { href: '/', label: 'Race' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/map', label: 'Map' },
  { href: '/teams', label: 'Teams' },
  { href: '/prizes', label: 'Prizes' },
  { href: '/info', label: 'Info' }
]

export default function Sidebar() {
  return (
    <aside className="w-24 h-screen flex flex-col items-center py-6 gap-6 bg-elevated border-r border-border">
      <div className="w-12 h-12 rounded-full bg-yellow flex items-center justify-center text-black font-bold">T</div>
      <nav className="flex-1 flex flex-col gap-2">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="text-sm text-secondaryText text-center py-2 hover:bg-yellow/10 rounded">
            {it.label}
          </Link>
        ))}
      </nav>
      <div className="text-xs text-secondaryText text-center px-2">THE JOURNEY\nNEVER STOPS</div>
    </aside>
  )
}
