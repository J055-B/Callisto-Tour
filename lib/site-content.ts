import { put, get } from '@vercel/blob'

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
// if the blob store isn't reachable, so a missing/misconfigured token
// degrades to "site looks normal" rather than crashing. Uses get() (not a
// plain fetch on a public URL) because the store is private — Vercel Blob
// doesn't allow changing a store's access mode after creation, and public
// vs private has to match on every read/write or the SDK rejects it (the
// "Cannot use public access on a private store" error, Aug 2026).
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const result = await get(CONTENT_PATHNAME, { access: 'private' })
    if (!result) return DEFAULT_CONTENT
    const text = await new Response(result.stream).text()
    const overrides = JSON.parse(text) as Partial<SiteContent>
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
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  })
  return next
}
