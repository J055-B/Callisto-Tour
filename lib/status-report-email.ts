import { LeaderboardEntry } from './types'
import { MILESTONE_STAGES, milestonePositionForDistance } from './milestones'
import { currentWeekEnd, weeklyTargetForToday, computeTargetPct } from './calculations'

export const STATUS_REPORT_SUBJECT = 'Tour de Callisto — Status Report'

// Targets range wildly by pool — FTD's are small counts (4, 7, 21) but
// RET's are revenue amounts (6,397.73, 31,988.65) that read as visual
// clutter next to FTD's in the same table. Caps every target at 3
// significant figures, with a "K" suffix once it crosses 1,000 — per
// Joss: "7" stays "7", "45.7" stays "45.7", but "31,988.65" becomes "32K".
function formatTarget(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toPrecision(3).replace(/\.?0+$/, '') + 'K'
  }
  return Number(n.toPrecision(3)).toString()
}

function flagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return ''
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function currentCity(currentStage: string) {
  return (currentStage || '').split('→')[0]?.trim() || '—'
}

function medalColor(pos: number) {
  if (pos === 1) return '#FFD700'
  if (pos === 2) return '#C0C0C0'
  if (pos === 3) return '#CD7F32'
  return '#8B999F'
}

// The stage right after the one this team is currently on — same idea as
// the Hero panel's "NEXT STAGE" card, just computed per-team here instead
// of only for the leader.
function nextStageLabel(totalDistance: number): string {
  const { stageIndex } = milestonePositionForDistance(totalDistance)
  const nextIndex = stageIndex >= MILESTONE_STAGES.length ? 0 : stageIndex
  const next = MILESTONE_STAGES[nextIndex]
  return next ? next.label : '—'
}

// "2d 14h" / "6h 20m" until Israel midnight closes out the current week —
// same wall-clock-safe timezone conversion StageSummary.tsx uses for
// "BOARD CLOSES IN", just aimed at the week's last day instead of today.
function timeUntilWeekEnd(): string {
  const endDateStr = currentWeekEnd()
  const now = new Date()
  const israelNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }))
  const target = new Date(`${endDateStr}T00:00:00`)
  target.setDate(target.getDate() + 1) // the END of endDateStr = the START of the next day
  const diffMs = target.getTime() - israelNow.getTime()
  if (diffMs <= 0) return 'Wrapping up now'
  const days = Math.floor(diffMs / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h`
  const minutes = Math.floor((diffMs % 3600000) / 60000)
  return `${hours}h ${minutes}m`
}

function standingsRows(entries: LeaderboardEntry[]) {
  return entries
    .map((e, i) => {
      const pos = i + 1
      const flag = flagEmoji(e.countryCode)
      return `
      <tr style="border-bottom:1px solid #1D292F;">
        <td style="padding:14px 10px;font-size:15px;font-weight:bold;color:${medalColor(pos)};">${pos}</td>
        <td style="padding:14px 10px;font-size:15px;font-weight:bold;color:#F4F7F8;">${e.teamCode}</td>
        <td style="padding:14px 10px;font-size:13px;color:#8B999F;">${e.currentStage || '—'}</td>
        <td style="padding:14px 10px;font-size:13px;color:#2F81FF;">${nextStageLabel(e.totalDistance)}</td>
        <td style="padding:14px 10px;font-size:14px;color:#F4F7F8;text-align:right;">${Math.round(e.totalDistance).toLocaleString()} km</td>
        <td style="padding:14px 10px;font-size:14px;color:#F4F7F8;">${flag} ${currentCity(e.currentStage)}</td>
      </tr>`
    })
    .join('')
}

// Matches the on-site "WEEKLY LEADERBOARD" section's own columns exactly
// (Daily Target / % of Target / Weekly Target / % of Weekly Target) —
// weeklySales (raw sales, not km) against weeklyTarget, same fixed unit
// mismatch this whole feature had until the Aug 2026 "3,653%" bug got
// caught and corrected; see DetailedLeaderboard.tsx.
function weeklyRows(entries: LeaderboardEntry[]) {
  return entries
    .map((e, i) => {
      const pos = i + 1
      const weeklyTarget = weeklyTargetForToday(e.dailyTarget, e.teamCode)
      const weeklyPct = computeTargetPct(e.weeklySales, weeklyTarget)
      const weeklyColor = weeklyPct > 100 ? '#2DD4BF' : weeklyPct >= 50 ? '#56D92B' : weeklyPct >= 20 ? '#F5C518' : '#FF453A'
      return `
      <tr style="border-bottom:1px solid #1D292F;">
        <td style="padding:14px 10px;font-size:15px;font-weight:bold;color:${medalColor(pos)};">${pos}</td>
        <td style="padding:14px 10px;font-size:15px;font-weight:bold;color:#F4F7F8;">${e.teamCode}</td>
        <td style="padding:14px 10px;font-size:12px;color:#8B999F;">${e.pool}</td>
        <td style="padding:14px 10px;font-size:14px;color:#F4F7F8;text-align:right;">${formatTarget(e.dailyTarget)}</td>
        <td style="padding:14px 10px;font-size:14px;color:#F4F7F8;text-align:right;">${formatTarget(weeklyTarget)}</td>
        <td style="padding:14px 10px;font-size:14px;font-weight:bold;color:${weeklyColor};text-align:right;">${weeklyPct.toFixed(1)}%</td>
      </tr>`
    })
    .join('')
}

const ENCOURAGEMENTS = [
  'Every sale is a kilometre closer to glory.',
  'The road never stops — and neither do you.',
  'Somewhere out there, a rival team just checked the board. Give them something to worry about.',
  'Legends aren\u2019t made on easy days. Keep pedalling.'
]

function pickEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
}

// Wide (1040px) status-report email — live standings (with each team's
// current AND next stage), the weekly leaderboard, a countdown to the
// weekly winner, and closing motivational copy + the Callisto logo.
// heroImageDataUri / logoImageDataUri are base64 data URIs (embedded
// directly in the HTML, not linked) so the email survives copy-paste into
// Gmail without depending on an externally-hosted image — see
// app/api/status-report/route.ts, which reads the files from disk and
// builds this server-side (a browser can't read local files, so this
// function itself stays a pure string-builder with no fs access).
export function buildStatusReportHtml(entries: LeaderboardEntry[], heroImageDataUri?: string, logoImageDataUri?: string): string {
  const generatedAt = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const heroStyle = heroImageDataUri
    ? `background-image:url('${heroImageDataUri}');background-size:cover;background-position:center 20%;`
    : `background:linear-gradient(135deg,#0B1114 0%,#05090B 100%);`
  const weekCountdown = timeUntilWeekEnd()

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Tour de Callisto — Status Report</title>
</head>
<body style="margin:0;padding:0;background:#e9e9e9;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e9e9;padding:32px 0;">
<tr><td align="center">

<table role="presentation" width="1040" cellpadding="0" cellspacing="0" style="background:#05090B;border-radius:12px;overflow:hidden;">

  <tr>
    <td style="${heroStyle}padding:60px 56px 44px 56px;text-align:center;">
      <div style="font-size:12px;letter-spacing:4px;color:#F4F7F8;margin-bottom:14px;text-shadow:0 2px 8px rgba(0,0,0,0.8);">&#10022; &nbsp; AUGUST 2026 EDITION &nbsp; &#10022;</div>
      <div style="font-size:52px;font-weight:bold;font-style:italic;color:#F4F7F8;line-height:1.1;text-shadow:0 2px 10px rgba(0,0,0,0.85);">
        TOUR DE <span style="color:#FFD400;">CALLISTO</span>
      </div>
      <div style="font-size:19px;color:#FFD400;font-weight:bold;letter-spacing:2px;margin-top:14px;text-shadow:0 2px 8px rgba(0,0,0,0.8);">STATUS REPORT</div>
      <div style="font-size:12px;color:#F4F7F8;margin-top:8px;text-shadow:0 2px 6px rgba(0,0,0,0.8);">Generated ${generatedAt}</div>
    </td>
  </tr>

  <tr>
    <td style="padding:32px 56px 8px 56px;text-align:center;">
      <div style="font-size:17px;font-style:italic;color:#D7DCDE;line-height:1.6;">${pickEncouragement()}</div>
    </td>
  </tr>

  <tr>
    <td style="padding:28px 56px 12px 56px;">
      <div style="font-size:13px;letter-spacing:3px;color:#FFD400;font-weight:bold;margin-bottom:16px;">&#9733; STANDINGS</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr style="border-bottom:2px solid #FFD400;">
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">POS</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">TEAM</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">CURRENT STAGE</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">NEXT STAGE</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;text-align:right;">TOTAL KM</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">CURRENT CITY</td>
        </tr>
        ${standingsRows(entries)}
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 56px 8px 56px;">
      <div style="background:linear-gradient(90deg,rgba(45,212,191,0.14),rgba(45,212,191,0.02));border:1px solid rgba(45,212,191,0.4);border-radius:10px;padding:16px 22px;display:flex;">
        <table role="presentation" width="100%"><tr>
          <td style="font-size:13px;color:#2DD4BF;font-weight:bold;letter-spacing:1px;">&#9201; TIME LEFT TO CROWN THIS WEEK'S WINNER</td>
          <td style="font-size:20px;color:#F4F7F8;font-weight:bold;text-align:right;">${weekCountdown}</td>
        </tr></table>
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding:24px 56px 12px 56px;">
      <div style="font-size:13px;letter-spacing:3px;color:#2DD4BF;font-weight:bold;margin-bottom:16px;">&#9733; WEEKLY LEADERBOARD</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr style="border-bottom:2px solid #2DD4BF;">
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">POS</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">TEAM</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;">POOL</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;text-align:right;">DAILY TARGET</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;text-align:right;">WEEKLY TARGET</td>
          <td style="padding:0 10px 10px 10px;font-size:11px;color:#8B999F;letter-spacing:1px;text-align:right;">% OF WEEKLY TARGET</td>
        </tr>
        ${weeklyRows(entries)}
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:40px 56px 20px 56px;text-align:center;border-top:1px solid #1D292F;margin-top:20px;">
      <div style="font-size:12px;color:#8B999F;letter-spacing:2px;margin-bottom:16px;">&#10022; &nbsp; &#10022; &nbsp; &#10022;</div>
      <div style="font-size:30px;font-weight:bold;font-style:italic;color:#FFD400;letter-spacing:1px;line-height:1.4;">
        BE BRAVE.<br/>GO FASTER.<br/>BE THE LEGEND.
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding:10px 56px 40px 56px;text-align:center;">
      ${logoImageDataUri ? `<img src="${logoImageDataUri}" alt="Callisto" style="max-width:220px;height:auto;" />` : '<div style="font-size:14px;color:#8B999F;">— The Tour de Callisto Team —</div>'}
    </td>
  </tr>

</table>

</td></tr>
</table>
</body>
</html>`
}
