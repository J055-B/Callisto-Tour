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
    // Most likely cause: no Blob store attached to this Vercel project yet
    // (BLOB_READ_WRITE_TOKEN missing) — see the setup note in the project
    // README / the message this shipped with.
    return NextResponse.json({ error: 'Could not save — is a Blob store connected to this project?' }, { status: 500 })
  }
}
