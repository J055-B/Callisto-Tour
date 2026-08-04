export type Segment = 'FTD' | 'RET'

export interface Team {
  id: string
  teamCode: string
  pool: 'FTD' | 'RET'
  initials: string
  location: string
  language: string
  dailyTarget: number
  salesToday: number
  countryCode: string
  countryName: string
  currentStage: string
  dailyHistory?: { date: string; sales: number }[]
  totalDistance?: number
  weeklyDistance?: number
}

export interface LeaderboardEntry extends Team {
  targetPct: number
  kmToday: number
  totalDistance: number
  weeklyDistance: number
  gap: number
  lap: number
}

export interface RoutePoint {
  id: string
  name: string
  coords: [number, number]
}
