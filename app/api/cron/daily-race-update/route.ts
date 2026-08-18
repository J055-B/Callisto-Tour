import { NextResponse } from 'next/server'
import { getLeaderboard } from '../../../../lib/data-source'
import { buildRaceUpdateEmail, RACE_UPDATE_EMAIL_SUBJECT } from '../../../../lib/race-update-email'
import { sendMail } from '../../../../lib/send-email'

export const dynamic = 'force-dynamic'

const RECIPIENT = 'mundial@callistogroup.org'

// Vercel Cron hits this URL daily (see vercel.json) — protected by
// CRON_SECRET so a random person who finds the URL can't trigger an email
// blast. Vercel automatically sends "Authorization: Bearer $CRON_SECRET"
// on cron-triggered requests once that env var is set; anything else
// (browser visits, curl without the header) gets rejected.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const entries = await getLeaderboard()
    const origin = new URL(req.url).origin
    const html = buildRaceUpdateEmail(entries, origin)
    await sendMail({ to: RECIPIENT, subject: RACE_UPDATE_EMAIL_SUBJECT, html })
    return NextResponse.json({ ok: true, sentTo: RECIPIENT, teamCount: entries.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[cron/daily-race-update] failed:', err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
