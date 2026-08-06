import { Team, LeaderboardEntry } from './types'
import { LOOP_KM, positionForDistance } from '../data/route'

// Tour de Callisto — 10 to 31 August 2026, one-off event (see the One Pager).
export const TOUR_START = '2026-08-10'
const TOUR_END = '2026-08-31'

const WEEKS = [
  { start: '2026-08-10', end: '2026-08-16' }, // Week 1
  { start: '2026-08-17', end: '2026-08-23' }, // Week 2
  { start: '2026-08-24', end: '2026-08-31' } // Week 3 (8 days)
]

// km awarded per 1% of daily target hit. Default is 10 (100% = 1,000km).
// Power Stage weekends pay more; everything else uses DEFAULT_RATE.
const POWER_RATE: Record<string, number> = {
  '2026-08-15': 15, // Power Stage 1 (Week 1 weekend)
  '2026-08-16': 15,
  '2026-08-22': 15, // Power Stage 2 (Week 2 weekend)
  '2026-08-23': 15,
  '2026-08-29': 12.5, // Final Power Stage (Week 3 weekend)
  '2026-08-30': 12.5
}
const DEFAULT_RATE = 10

function ratePerPercent(dateStr: string) {
  return POWER_RATE[dateStr] ?? DEFAULT_RATE
}

// Mon-Thu each get their own full daily target. Fri/Sat/Sun share one daily
// target instead of a fresh one per day — a no-op for every team except
// Madagascar (merged into "MADA + FR" — the Target sheet only gives that
// pair one combined target), which actually works through that block and
// gets double the shared target to compensate.
function isMadaSharedWeekendDay(teamCode: string, dateStr: string) {
  if (teamCode !== 'MADA + FR') return false
  const weekday = new Date(dateStr + 'T00:00:00Z').getUTCDay() // 0=Sun … 5=Fri, 6=Sat
  return weekday === 0 || weekday === 5 || weekday === 6
}

function dailyTargetForDate(team: Team, dateStr: string) {
  return team.dailyTarget * (isMadaSharedWeekendDay(team.teamCode, dateStr) ? 2 : 1)
}

export function computeTargetPct(sales: number, target: number) {
  if (!target) return 0
  return (sales / target) * 100
}

function kmForDay(team: Team, dateStr: string, sales: number) {
  const target = dailyTargetForDate(team, dateStr)
  const pct = computeTargetPct(sales, target)
  return pct * ratePerPercent(dateStr)
}

function weekFor(dateStr: string) {
  return WEEKS.find((w) => dateStr >= w.start && dateStr <= w.end)
}

function clampToTourRange(dateStr: string) {
  if (dateStr < TOUR_START) return TOUR_START
  if (dateStr > TOUR_END) return TOUR_END
  return dateStr
}

function eachDateBetween(start: string, end: string) {
  const dates: string[] = []
  let cursor = new Date(start + 'T00:00:00Z')
  const last = new Date(end + 'T00:00:00Z')
  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
  }
  return dates
}

interface TeamMetrics {
  salesToday: number
  targetPct: number
  kmToday: number
  totalDistance: number
  weeklyDistance: number
}

function computeTeamMetrics(team: Team, todayStr: string): TeamMetrics {
  const salesByDate = new Map((team.dailyHistory ?? []).map((d) => [d.date, d.sales]))
  const lastDay = clampToTourRange(todayStr)
  const currentWeek = weekFor(todayStr) ?? weekFor(lastDay)

  let totalDistance = 0
  let weeklyDistance = 0

  if (todayStr >= TOUR_START) {
    for (const date of eachDateBetween(TOUR_START, lastDay)) {
      const sales = salesByDate.get(date) ?? 0
      const km = kmForDay(team, date, sales)
      totalDistance += km
      if (currentWeek && date >= currentWeek.start && date <= currentWeek.end) {
        weeklyDistance += km
      }
    }
  }

  const salesToday = salesByDate.get(todayStr) ?? 0
  const targetPct = computeTargetPct(salesToday, dailyTargetForDate(team, todayStr))
  const kmToday = kmForDay(team, todayStr, salesToday)

  return { salesToday, targetPct, kmToday, totalDistance, weeklyDistance }
}

export function computeLap(totalDistance: number) {
  return Math.floor(totalDistance / LOOP_KM) + 1
}

// Teams arrive already merged where the Target sheet only has one combined
// row for them (MADA + FTD IL FR) — see data-source.ts's getTeams().
export function computeLeaderboard(teams: Team[], today: Date = new Date()) {
  const todayStr = today.toISOString().slice(0, 10)

  const entries: LeaderboardEntry[] = teams.map((t) => {
    const metrics = computeTeamMetrics(t, todayStr)
    const position = positionForDistance(metrics.totalDistance)
    return {
      ...t,
      salesToday: metrics.salesToday,
      targetPct: metrics.targetPct,
      kmToday: metrics.kmToday,
      totalDistance: metrics.totalDistance,
      weeklyDistance: metrics.weeklyDistance,
      // Live race position, not the team's home desk — see positionForDistance.
      countryCode: position.countryCode,
      countryName: position.countryName,
      currentStage: position.currentStage,
      kmToNextWaypoint: position.kmToNextWaypoint,
      legProgressPct: position.legProgressPct,
      gap: 0,
      lap: computeLap(metrics.totalDistance)
    }
  })

  entries.sort((a, b) => b.totalDistance - a.totalDistance)
  const leader = entries[0]
  if (leader) {
    entries.forEach((e) => {
      e.gap = Math.round(leader.totalDistance - e.totalDistance)
    })
  }
  return entries
}
