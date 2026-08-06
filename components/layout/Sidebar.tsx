'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BarChart3, Map, Trophy, Gift, Info } from 'lucide-react'

const items = [
  { href: '/', label: 'Race', icon: Activity },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/teams', label: 'Teams', icon: BarChart3 },
  { href: '/prizes', label: 'Prizes', icon: Gift },
  { href: '/info', label: 'Info', icon: Info }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-24 h-screen flex flex-col items-center py-6 gap-6 bg-elevated border-r border-border">
      <div className="w-12 h-12 rounded-full bg-yellow flex items-center justify-center text-black font-bold text-xl">T</div>
      <nav className="flex-1 flex flex-col gap-3">
        {items.map((it) => {
          const Icon = it.icon
          const active = it.href === '/' ? pathname === '/' : pathname?.startsWith(it.href)
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                'flex h-12 w-12 items-center justify-center rounded-full transition-colors ' +
                (active ? 'bg-yellow/15 text-yellow ring-2 ring-yellow' : 'text-secondaryText hover:bg-yellow/10 hover:text-yellow')
              }
              aria-label={it.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} />
            </Link>
          )
        })}
      </nav>
      <div className="text-center text-[10px] text-secondaryText leading-4 px-2">THE JOURNEY<br />NEVER STOPS</div>
    </aside>
  )
}
