import { NextResponse } from 'next/server'
import { getSiteContent, saveSiteContent } from '../../../lib/site-content'
import { ADMIN_USER, ADMIN_PASS } from '../../../lib/session'

export const dynamic = 'force-dynamic'

// GET — anyone can read the current (shared) content; used on every page
// load so all visitors see the same edited text, not just the admin who
// made the change.
export async function GET() {
  const content = await getSiteContent()
  return NextResponse.json(content)
}

// POST — only saves if the request includes the same Admin user/password
// checked client-side at login (see lib/session.ts's comment on why this
// is a casual gate, not real auth — it stops accidental/casual edits, not
// a determined bad actor who reads the client bundle).
export async function POST(req: Request) {
  let body: { username?: string; password?: string; updates?: Record<string, string> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (body.username !== ADMIN_USER || body.password !== ADMIN_PASS) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!body.updates || typeof body.updates !== 'object') {
    return NextResponse.json({ error: 'Missing updates' }, { status: 400 })
  }

  try {
    const content = await saveSiteContent(body.updates)
    return NextResponse.json(content)
  } catch (err) {
    // Log the real error to Vercel's function logs (Project → Logs) even
    // though the JSON response below already includes it too — belt and
    // suspenders, in case the response ever gets swallowed by something
    // upstream (a proxy, a browser extension, etc).
    console.error('[api/content] saveSiteContent failed:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Could not save: ${message}` }, { status: 500 })
  }
}
