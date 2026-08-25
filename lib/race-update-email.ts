import { LeaderboardEntry } from './types'
import { computeTargetPct, weeklyTargetForToday, TOUR_START } from './calculations'
import route, { LOOP_KM } from '../data/route'

export const RACE_UPDATE_EMAIL_SUBJECT = 'Tour de Callisto — Live Race Update'

const GOLD = '#FFD400'
const GOLD_DARK = '#B88600'
const BG = '#05090B'
const PANEL = '#0B1114'
const PANEL_2 = '#10181C'
const BORDER = '#263238'
const WHITE = '#F4F7F8'
const MUTED = '#A6B0B5'
const RED = '#FF453A'
const GREEN = '#56D92B'
const TEAL = '#2DD4BF'

function esc(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function pct(value: number) {
  return `${value.toFixed(1)}%`
}

function km(value: number) {
  return `${Math.round(value).toLocaleString()} km`
}

function sales(value: number) {
  // Keep leaderboard targets compact: at most 3 significant digits.
  // Large values use K/M suffixes so the email table stays readable.
  if (!Number.isFinite(value)) return '—'

  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  const format = (scaled: number, suffix: string) => {
    const rounded = Number(scaled.toPrecision(3))
    return `${sign}${rounded.toLocaleString('en-US', { maximumFractionDigits: 3 })}${suffix}`
  }

  if (abs >= 1_000_000) return format(value / 1_000_000, 'M')
  if (abs >= 1_000) return format(value / 1_000, 'K')

  // Values below 1000 keep up to 3 significant digits, e.g. 3.15 or 75.3.
  const rounded = Number(abs.toPrecision(3))
  return `${sign}${rounded.toLocaleString('en-US', { maximumFractionDigits: 3 })}`
}

function progressColor(value: number, overflow = false) {
  if (overflow && value > 100) return TEAL
  if (value <= 0) return RED
  const ratio = Math.max(0, Math.min(1, value / 100))
  const r = Math.round(255 + (86 - 255) * ratio)
  const g = Math.round(69 + (217 - 69) * ratio)
  const b = Math.round(58 + (43 - 58) * ratio)
  return `rgb(${r},${g},${b})`
}

function daysUntil(date: string, today: Date) {
  const target = new Date(`${date}T00:00:00Z`).getTime()
  const current = new Date(`${today.toISOString().slice(0, 10)}T00:00:00Z`).getTime()
  return Math.max(0, Math.ceil((target - current) / 86400000))
}

function currentWeekInfo(today: Date) {
  const date = today.toISOString().slice(0, 10)
  const weeks = [
    { start: '2026-08-10', end: '2026-08-16' },
    { start: '2026-08-17', end: '2026-08-23' },
    { start: '2026-08-24', end: '2026-08-31' }
  ]
  return weeks.find((week) => date >= week.start && date <= week.end) ??
    (date < TOUR_START ? weeks[0] : weeks[weeks.length - 1])
}



export function buildRaceUpdateEmail(entries: LeaderboardEntry[], origin: string, today = new Date()) {
  const sorted = [...entries].sort((a, b) => b.totalDistance - a.totalDistance)
  const weeklySorted = [...entries].sort((a, b) => b.weeklyDistance - a.weeklyDistance)
  const leader = sorted[0]
  const weeklyLeader = weeklySorted[0]
  const week = currentWeekInfo(today)
  const remainingDays = daysUntil(week.end, today)
  const heroUrl = `${origin.replace(/\/$/, '')}/images/tour-email-hero.jpg`
  const bikeUrl = `${origin.replace(/\/$/, '')}/images/Bicycle-transparent.png`
  const iconUrl = `${origin.replace(/\/$/, '')}/images/Callisto%20Icon.png`

  const liveRows = sorted.map((e, index) => {
    const pos = index + 1
    const journeyPct = ((e.totalDistance % LOOP_KM) / LOOP_KM) * 100
    const distanceColor = progressColor(e.legProgressPct)
    const gap = e.gap === 0 ? '—' : `-${Math.abs(Math.round(e.gap)).toLocaleString()} km`
    const medal = pos === 1 ? '🏆' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : String(pos)
    const stageParts = e.currentStage.split(' → ')
    const current = e.currentStage || '—'
    let next = 'Next waypoint'
    if (stageParts.length === 2) {
      const destination = stageParts[1]
      const idx = route.findIndex((point) => point.name === destination)
      const following = idx >= 0 ? route[idx + 1] : undefined
      next = following ? `${destination} → ${following.name}` : `${destination} →`
    }
    return `<tr style="border-top:1px solid ${BORDER};">
      <td style="padding:9px 8px;color:${pos <= 3 ? GOLD : WHITE};font-weight:700;">${medal}</td>
      <td style="padding:9px 8px;color:${WHITE};font-weight:700;white-space:nowrap;">${esc(e.teamCode)}</td>
      <td style="padding:9px 8px;color:${WHITE};white-space:nowrap;">${km(e.totalDistance)}</td>
      <td style="padding:9px 8px;color:${progressColor(e.targetPct, true)};font-weight:700;white-space:nowrap;">${km(e.kmToday)}</td>
      <td style="padding:9px 8px;color:${e.gap === 0 ? MUTED : RED};font-weight:${e.gap === 0 ? 400 : 700};white-space:nowrap;">${gap}</td>
      <td style="padding:9px 8px;color:${MUTED};white-space:nowrap;">${esc(current)}</td>
      <td style="padding:9px 8px;color:${distanceColor};font-weight:700;white-space:nowrap;">${esc(next)}</td>
      <td style="padding:9px 8px;color:${progressColor(journeyPct)};font-weight:700;white-space:nowrap;">${pct(journeyPct)}</td>
    </tr>`
  }).join('')

  const weeklyRows = weeklySorted.map((e, index) => {
    const pos = index + 1
    const target = weeklyTargetForToday(e.dailyTarget, e.teamCode, today)
    const weeklyPct = computeTargetPct(e.weeklySales, target)
    const medal = pos === 1 ? '🏆' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : String(pos)
    return `<tr style="border-top:1px solid ${BORDER};">
      <td style="padding:9px 8px;color:${pos <= 3 ? GOLD : WHITE};font-weight:700;">${medal}</td>
      <td style="padding:9px 8px;color:${WHITE};font-weight:700;white-space:nowrap;">${esc(e.teamCode)}</td>
      <td style="padding:9px 8px;color:${WHITE};white-space:nowrap;">${sales(e.dailyTarget)}</td>
      <td style="padding:9px 8px;color:${progressColor(e.targetPct, true)};font-weight:700;white-space:nowrap;">${pct(e.targetPct)}</td>
      <td style="padding:9px 8px;color:${WHITE};white-space:nowrap;">${sales(target)}</td>
      <td style="padding:9px 8px;color:${progressColor(weeklyPct, true)};font-weight:700;white-space:nowrap;">${pct(weeklyPct)}</td>
    </tr>`
  }).join('')

  const currentLeaderDistance = leader ? km(leader.totalDistance) : '—'
  const weeklyLeaderPct = weeklyLeader ? computeTargetPct(weeklyLeader.weeklySales, weeklyTargetForToday(weeklyLeader.dailyTarget, weeklyLeader.teamCode, today)) : 0

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(RACE_UPDATE_EMAIL_SUBJECT)}</title></head>
<body style="margin:0;padding:0;background:#E8EAEB;font-family:Arial,Helvetica,sans-serif;color:${WHITE};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E8EAEB;">
<tr><td align="center" style="padding:24px 0;">
<table role="presentation" width="1120" cellpadding="0" cellspacing="0" border="0" style="width:1120px;max-width:1120px;background:${BG};">

<tr><td style="padding:20px 34px 17px;background:#080D10;border-bottom:2px solid ${GOLD};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td valign="middle" style="width:72px;"><img src="${iconUrl}" width="58" height="58" alt="Callisto" style="display:block;border:0;object-fit:contain;"></td>
    <td valign="middle"><div style="font-size:32px;line-height:34px;font-weight:800;font-style:italic;color:${WHITE};">TOUR DE <span style="color:${GOLD};">CALLISTO</span></div><div style="font-size:15px;line-height:20px;color:${MUTED};letter-spacing:1px;">AUGUST 2026 EDITION</div></td>
    <td align="right" valign="middle"><img src="${bikeUrl}" width="62" height="62" alt="" style="display:block;border:0;object-fit:contain;"></td>
  </tr></table>
</td></tr>

<tr><td style="height:260px;background:${BG};line-height:0;font-size:0;"><img src="${heroUrl}" width="1040" height="260" alt="" style="display:block;width:100%;max-width:1040px;height:260px;object-fit:cover;border:0;"></td></tr>

<tr><td style="padding:24px 34px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="top" style="padding-right:20px;width:34%;"><div style="font-size:30px;line-height:34px;font-weight:800;font-style:italic;color:${WHITE};">THE <span style="color:${GOLD};">RACE</span> IS ON.</div><div style="font-size:15px;line-height:22px;color:${MUTED};margin-top:5px;">Every kilometre matters. Every sale moves the team forward.</div></td>
<td width="66%"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="padding:13px 12px;border:1px solid ${GOLD_DARK};background:${PANEL_2};" align="center"><div style="font-size:10px;color:${MUTED};letter-spacing:1px;">CURRENT LEADER</div><div style="font-size:17px;font-weight:800;color:${WHITE};margin-top:4px;">${esc(leader?.teamCode ?? '—')}</div><div style="font-size:13px;color:${WHITE};">${currentLeaderDistance}</div></td>
<td style="width:8px;"></td>
<td style="padding:13px 12px;border:1px solid ${GOLD_DARK};background:${PANEL_2};" align="center"><div style="font-size:10px;color:${MUTED};letter-spacing:1px;">WEEKLY LEADER</div><div style="font-size:17px;font-weight:800;color:${WHITE};margin-top:4px;">${esc(weeklyLeader?.teamCode ?? '—')}</div><div style="font-size:13px;font-weight:800;color:${GOLD};">${pct(weeklyLeaderPct)}</div></td>
<td style="width:8px;"></td>
<td style="padding:13px 12px;border:1px solid ${GOLD_DARK};background:${PANEL_2};" align="center"><div style="font-size:10px;color:${MUTED};letter-spacing:1px;">WEEKLY TARGET</div><div style="font-size:22px;font-weight:800;color:${GOLD};margin-top:4px;">${pct(weeklyLeaderPct)}</div><div style="font-size:12px;color:${MUTED};">of weekly target</div></td>
<td style="width:8px;"></td>
<td style="padding:13px 12px;border:1px solid ${GOLD_DARK};background:${PANEL_2};" align="center"><div style="font-size:10px;color:${MUTED};letter-spacing:1px;">TIME LEFT</div><div style="font-size:22px;font-weight:800;color:${GOLD};margin-top:4px;">${remainingDays} DAYS</div><div style="font-size:12px;color:${MUTED};">until winner crowned</div></td>
</tr></table></td>
</tr></table>
</td></tr>

<tr><td style="padding:8px 34px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="top" width="57%" style="padding-right:10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${GOLD_DARK};background:${PANEL};"><tr><td style="padding:12px 12px 8px;font-size:16px;font-weight:800;font-style:italic;color:${GOLD};">🔴 LIVE LEADERBOARD</td></tr><tr><td style="padding:0 8px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:11px;"><tr style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:.7px;"><td style="padding:7px 8px;">POS</td><td>TEAM</td><td>CURRENT KM</td><td>TODAY</td><td>GAP</td><td>CURRENT STAGE</td><td>NEXT STAGE</td><td>% JOURNEY</td></tr>${liveRows}</table>
</td></tr></table></td>
<td valign="top" width="43%" style="padding-left:10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${GOLD_DARK};background:${PANEL};"><tr><td style="padding:12px 12px 8px;font-size:16px;font-weight:800;font-style:italic;color:${GOLD};">🏆 WEEKLY LEADERBOARD</td></tr><tr><td style="padding:0 8px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:11px;"><tr style="color:${MUTED};font-size:9px;text-transform:uppercase;letter-spacing:.7px;"><td style="padding:7px 8px;">POS</td><td>TEAM</td><td>DAILY TARGET</td><td>% TARGET</td><td>WEEKLY TARGET</td><td>% WEEKLY</td></tr>${weeklyRows}</table>
</td></tr></table></td>
</tr></table>
</td></tr>

<tr><td style="padding:0 34px 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="middle" width="24%" style="border:1px solid ${GOLD_DARK};background:${PANEL_2};padding:18px;text-align:center;"><div style="font-size:12px;color:${MUTED};letter-spacing:2px;">ONLY</div><div style="font-size:42px;line-height:44px;color:${GOLD};font-weight:900;">${remainingDays} DAYS</div><div style="font-size:11px;color:${WHITE};letter-spacing:1px;">UNTIL THE WEEKLY WINNER IS CROWNED</div></td>
<td width="2%"></td>
<td valign="middle" width="34%" style="padding:12px 20px;color:${WHITE};font-size:15px;line-height:24px;">${esc(weeklyLeader?.teamCode ?? 'The current leader')} leads at <b style="color:${GOLD};">${pct(weeklyLeaderPct)}</b> of the weekly target!<br><span style="color:${MUTED};">But the race is far from over.</span><br><br><span style="color:${MUTED};">One strong day can change the entire leaderboard.<br>One great push can rewrite the standings.</span><br><b style="color:${GOLD};font-style:italic;">KEEP PUSHING. KEEP RIDING.</b></td>
<td width="2%"></td>
<td valign="middle" width="38%" style="text-align:center;">
<!--[if gte mso 9]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:426px;height:160px;">
<v:fill type="frame" src="${heroUrl}" color="#080D10" />
<v:textbox inset="0,0,0,0">
<![endif]-->
<div style="padding:18px 20px;background:#080D10 url('${heroUrl}') right center / cover no-repeat;text-align:center;"><div style="font-size:25px;line-height:30px;font-weight:900;font-style:italic;color:${GOLD};letter-spacing:1px;">POWER, SPEED, FAME...</div><div style="font-size:22px;color:${WHITE};font-style:italic;margin-top:8px;">Be a <span style="font-size:58px;line-height:60px;font-weight:900;color:${GOLD};text-shadow:0 0 14px rgba(255,212,0,.25);">LEGEND</span></div></div>
<!--[if gte mso 9]>
</v:textbox>
</v:rect>
<![endif]-->
</td>
</tr></table></td></tr>

<tr><td style="padding:22px 34px 18px;border-top:1px solid ${GOLD_DARK};text-align:center;background:#080D10;">
<table role="presentation" align="center" cellpadding="0" cellspacing="0"><tr><td><img src="${iconUrl}" width="55" height="55" alt="Callisto" style="display:block;border:0;"></td><td style="padding-left:12px;text-align:left;"><div style="font-size:34px;color:${WHITE};line-height:34px;">callisto</div><div style="font-size:11px;color:${MUTED};letter-spacing:1px;">The Internet Planet</div></td></tr></table>
<div style="font-size:10px;letter-spacing:5px;color:${GOLD};margin-top:18px;">THE JOURNEY NEVER STOPS.</div>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}
