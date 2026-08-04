import teamsRaw from '../data/teams'
import route from '../data/route'
import { computeLeaderboard } from './calculations'
import { Team, LeaderboardEntry, RoutePoint } from './types'

export async function getTeams(): Promise<Team[]> {
  // In future replace this with API or GViz sheet import
  return teamsRaw as Team[]
}

export async function getRoute(): Promise<RoutePoint[]> {
  return route
}

export async function getLeaderboard(stageNumber = 1): Promise<LeaderboardEntry[]> {
  const t = await getTeams()
  return computeLeaderboard(t, stageNumber)
}

export async function getCompetitionState() {
  const leaderboard = await getLeaderboard()
  return {
    leaderboard,
    route: await getRoute()
  }
}
