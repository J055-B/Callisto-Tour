import { put, head } from '@vercel/blob'

// Every title/subtitle across the site the Admin can edit — keyed by a
// stable id, with the text as it ships by default. Vercel Blob only ever
// stores the OVERRIDES (what's actually been edited), never a full copy of
// this list, so adding a new editable spot later doesn't require migrating
// anything already saved.
export const DEFAULT_CONTENT: Record<string, string> = {
  'header.titleLine1': 'TOUR DE',
  'header.titleLine2': 'CALLISTO',
  'header.subtitle': 'AUGUST 2026 EDITION',

  'dashboard.liveStatus.title': 'LIVE LEADERBOARD',

  'leaderboard.title': 'LEADERBOARD',
  'leaderboard.subtitle': 'Live team standings, updated in real time',
  'teamTargets.title': 'TEAM TARGETS',
  'teamTargets.subtitle': 'Daily pace vs weekly pace, per team',

  'prizes.tourChampion.title': 'TOUR CHAMPION',
  'prizes.tourChampion.subtitle': 'Main competition prize',
  'prizes.weeklyWinner.title': 'WEEKLY WINNER',
  'prizes.weeklyWinner.subtitle': "Most km for each completed week — locked in once that week ends",

  'route.title': 'Route'
}

export type SiteContent = Record<string, string>

// Fixed pathname (not the random-suffixed default) so the same blob gets
// overwritten on every save instead of piling up a new file per edit.
const CONTENT_PATHNAME = 'site-content.json'

// Reads the live, shared content — every visitor gets the same values,
// since this comes from Vercel Blob, not any one person's browser. Falls
// back to the shipped defaults if nothing's been saved yet (first run) or
// if the blob store isn't reachable, so a missing/misconfigured
// BLOB_READ_WRITE_TOKEN degrades to "site looks normal" rather than crashing.
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const blob = await head(CONTENT_PATHNAME)
    const res = await fetch(blob.url, { cache: 'no-store' })
    if (!res.ok) return DEFAULT_CONTENT
    const overrides = (await res.json()) as Partial<SiteContent>
    return { ...DEFAULT_CONTENT, ...overrides } as SiteContent
  } catch {
    return DEFAULT_CONTENT
  }
}

// Merges the given updates into whatever's already saved (not a full
// replace) and writes the result back to the same fixed pathname.
export async function saveSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
  const current = await getSiteContent()
  const next = { ...current, ...updates } as SiteContent
  await put(CONTENT_PATHNAME, JSON.stringify(next), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  })
  return next
}
