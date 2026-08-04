import { Team, LeaderboardEntry } from './types'

const LOOP_KM = 16696

export function computeTargetPct(sales: number, target: number) {
  if (target === 0) return 0
  return (sales / target) * 100
}

export function milestoneForStage(stageNumber: number) {
  // power stages: 5,10,15
  if (stageNumber === 5 || stageNumber === 10) return 1500
  if (stageNumber === 15) return 1250
  return 1000
}

export function computeDailyKm(sales: number, target: number, stageNumber = 1) {
  const pct = computeTargetPct(sales, target)
  const milestone = milestoneForStage(stageNumber)
  return (milestone / 100) * pct
}

export function computeLap(totalDistance: number) {
  return Math.floor(totalDistance / LOOP_KM) + 1
}

export function computeLeaderboard(teams: Team[], stageNumber = 1) {
  const map: LeaderboardEntry[] = teams.map((t) => {
    const targetPct = computeTargetPct(t.salesToday, t.dailyTarget)
    const kmToday = computeDailyKm(t.salesToday, t.dailyTarget, stageNumber)
    const totalDistance = (t['totalDistance'] as number) || 0
    const weeklyDistance = (t['weeklyDistance'] as number) || 0
    return {
      ...t,
      targetPct,
      kmToday,
      totalDistance,
      weeklyDistance,
      gap: 0,
      lap: computeLap(totalDistance)
    }
  })

  // sort by totalDistance desc
  map.sort((a, b) => b.totalDistance - a.totalDistance)
  const leader = map[0]
  if (leader) {
    map.forEach((m) => {
      m.gap = Math.round(leader.totalDistance - m.totalDistance)
    })
  }
  return map
}

export { LOOP_KM }
