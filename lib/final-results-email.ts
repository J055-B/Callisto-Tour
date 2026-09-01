import { LeaderboardEntry } from './types'
import { computeWeeklyWinners } from './calculations'
import { flagUrl } from './flags'

export const FINAL_RESULTS_EMAIL_SUBJECT = 'Tour de Callisto — Final Results'

const GOLD = '#FFD400'
const GOLD_DARK = '#B88600'
const BG = '#05090B'
const PANEL = '#0B1114'
const PANEL_2 = '#10181C'
const BORDER = '#263238'
const WHITE = '#F4F7F8'
const MUTED = '#A6B0B5'

// Hero/side images are scaled to this content width (matches the daily race
// update email's 1040px content column) — each height is derived from the
// image's real aspect ratio so it never looks stretched or cropped.
const CONTENT_WIDTH = 1040
const GLORY_ASPECT = 941 / 1672 // glory-to-the-winner.png
const CHAMPIONS_ASPECT = 1024 / 1536 // weekly-target-champions.png

function esc(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function km(value: number) {
  return `${Math.round(value).toLocaleString()} km`
}

const MEDAL = ['🥇', '🥈', '🥉']

export function buildFinalResultsEmail(entries: LeaderboardEntry[], origin: string, today = new Date()) {
  const base = origin.replace(/\/$/, '')
  const iconUrl = `${base}/images/Callisto%20Icon.png`
  const bikeUrl = `${base}/images/Bicycle-transparent.png`
  const gloryUrl = `${base}/images/glory-to-the-winner.png`
  const championsUrl = `${base}/images/weekly-target-champions.png`

  const sorted = [...entries].sort((a, b) => b.totalDistance - a.totalDistance)
  const winner = sorted[0]

  // Weekly winners come back in week order already (Week 1, 2, 3) — no
  // re-sorting needed, they render top to bottom exactly in that order.
  const weeklyWinners = computeWeeklyWinners(entries, today)

  const gloryHeight = Math.round(CONTENT_WIDTH * GLORY_ASPECT)

  // Side image in the weekly-champions panel — narrower than full content
  // width since it sits next to the winners list, not as a full banner.
  const podiumWidth = Math.round(CONTENT_WIDTH * 0.4)
  const podiumHeight = Math.round(podiumWidth * CHAMPIONS_ASPECT)

  const weeklyRows = weeklyWinners
    .map((week) => {
      const winnerEntry = week.winner ? sorted.find((e) => e.teamCode === week.winner!.teamCode) : undefined
      const flag = winnerEntry ? flagUrl(winnerEntry.countryCode) : undefined
      const flagImg = flag ? `<img src="${base}${flag}" width="20" height="14" alt="" style="display:inline-block;border:0;vertical-align:middle;border-radius:2px;margin-right:7px;">` : ''
      const medal = MEDAL[week.weekIndex - 1] ?? '🏁'
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;border:1px solid ${BORDER};background:${PANEL_2};">
        <tr>
          <td width="40" align="center" style="padding:10px 4px;font-size:20px;font-weight:900;color:${GOLD};">${medal}</td>
          <td style="padding:9px 10px 9px 4px;">
            <div style="font-size:9px;color:${MUTED};letter-spacing:.5px;">WEEK ${esc(week.weekIndex)} &nbsp;•&nbsp; ${esc(week.start)} – ${esc(week.end)}</div>
            <div style="font-size:14px;font-weight:800;color:${WHITE};margin-top:3px;">${flagImg}<span style="vertical-align:middle;">${esc(week.winner?.teamCode ?? '—')}</span></div>
            <div style="font-size:11px;color:${GOLD};font-weight:700;margin-top:4px;">${week.winner ? km(week.winner.weeklyDistance) : '—'}</div>
          </td>
        </tr>
      </table>`
    })
    .join('')

  // Full standings — every team, position 1 downward (the winner too).
  const standingsRows = sorted
    .map((e, i) => {
      const pos = i + 1
      const gap = e.gap === 0 ? '—' : `-${Math.abs(Math.round(e.gap)).toLocaleString()} km`
      const isWinner = pos === 1
      return `<tr style="border-top:1px solid ${BORDER};${isWinner ? `background:${GOLD}14;` : ''}">
        <td style="padding:10px 8px;color:${isWinner ? GOLD : MUTED};font-weight:${isWinner ? 800 : 400};font-size:12px;">${pos === 1 ? '🏆' : pos}</td>
        <td style="padding:10px 8px;color:${WHITE};font-weight:700;font-size:13px;">${esc(e.teamCode)}</td>
        <td style="padding:10px 8px;text-align:right;color:${WHITE};font-size:12px;white-space:nowrap;">${km(e.totalDistance)}</td>
        <td style="padding:10px 8px;text-align:right;color:${e.gap === 0 ? MUTED : '#FF453A'};font-weight:700;font-size:12px;white-space:nowrap;">${gap}</td>
      </tr>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(FINAL_RESULTS_EMAIL_SUBJECT)}</title></head>
<body style="margin:0;padding:0;background:#E8EAEB;font-family:Arial,Helvetica,sans-serif;color:${WHITE};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E8EAEB;">
<tr><td align="center" style="padding:24px 0;">
<table role="presentation" width="${CONTENT_WIDTH}" cellpadding="0" cellspacing="0" border="0" style="width:${CONTENT_WIDTH}px;max-width:${CONTENT_WIDTH}px;background:${BG};">

<!-- HEADER -->
<tr><td style="padding:20px 34px 17px;background:#080D10;border-bottom:2px solid ${GOLD};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td valign="middle" style="width:72px;"><img src="${iconUrl}" width="58" height="58" alt="Callisto" style="display:block;border:0;object-fit:contain;"></td>
    <td valign="middle"><div style="font-size:32px;line-height:34px;font-weight:800;font-style:italic;color:${WHITE};">TOUR DE <span style="color:${GOLD};">CALLISTO</span></div><div style="font-size:15px;line-height:20px;color:${MUTED};letter-spacing:1px;">FINAL RESULTS</div></td>
    <td align="right" valign="middle"><img src="${bikeUrl}" width="62" height="62" alt="" style="display:block;border:0;object-fit:contain;"></td>
  </tr></table>
</td></tr>

<!-- HERO — Glory to the Winner, with the champion's name overlaid in the banner's blank plate, in gold with a shimmer glow -->
<tr><td style="background:${BG};line-height:0;font-size:0;">
  <div style="position:relative;width:${CONTENT_WIDTH}px;height:${gloryHeight}px;">
    <img src="${gloryUrl}" width="${CONTENT_WIDTH}" height="${gloryHeight}" alt="Glory to the winner" style="display:block;width:${CONTENT_WIDTH}px;height:${gloryHeight}px;object-fit:cover;border:0;">
    <div style="position:absolute;left:0;right:0;bottom:${Math.round(gloryHeight * 0.048)}px;text-align:center;line-height:0;font-size:0;">
      <span style="display:inline-block;font-size:${Math.round(gloryHeight * 0.078)}px;line-height:1;font-weight:900;font-style:italic;letter-spacing:2px;color:${GOLD};text-shadow:0 0 6px rgba(255,255,255,.55),0 0 22px rgba(255,212,0,.85),0 0 46px rgba(255,212,0,.5);">${esc(winner?.teamCode ?? '—')}</span>
    </div>
  </div>
</td></tr>

<!-- TITLE -->
<tr><td style="padding:25px 34px 15px;">
<div style="font-size:30px;font-weight:900;font-style:italic;color:${WHITE};">THE RACE IS <span style="color:${GOLD};">OVER.</span></div>
<div style="font-size:21px;font-weight:900;font-style:italic;color:${GOLD};margin-top:2px;">THE BATTLE IS WON.</div>
<div style="font-size:13px;letter-spacing:1px;color:${MUTED};margin-top:8px;">EVENT FINISHED &nbsp;•&nbsp; PASSION. EFFORT. SWEAT. GLORY.</div>
</td></tr>

<!-- Real stats for the champion -->
<tr><td style="padding:10px 34px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${GOLD_DARK};background:${PANEL};">
<tr><td style="padding:14px 24px;text-align:center;">
<span style="display:inline-block;background:${GOLD};color:#080909;font-size:12px;font-weight:900;letter-spacing:1px;padding:6px 16px;">🏆 TOUR CHAMPION — ${esc(winner?.teamCode ?? '—')}</span>
</td></tr>
<tr><td style="border-top:1px solid ${GOLD_DARK};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="33.3%" align="center" style="padding:16px 8px;border-right:1px solid ${GOLD_DARK};"><div style="font-size:10px;color:${GOLD};letter-spacing:1px;">TOTAL DISTANCE</div><div style="font-size:22px;font-weight:800;color:${WHITE};margin-top:5px;">${winner ? km(winner.totalDistance) : '—'}</div></td>
<td width="33.3%" align="center" style="padding:16px 8px;border-right:1px solid ${GOLD_DARK};"><div style="font-size:10px;color:${GOLD};letter-spacing:1px;">FINISHING POSITION</div><div style="font-size:22px;font-weight:800;color:${WHITE};margin-top:5px;">${esc(winner?.currentStage || winner?.countryName || '—')}</div></td>
<td width="33.3%" align="center" style="padding:16px 8px;"><div style="font-size:10px;color:${GOLD};letter-spacing:1px;">LAPS COMPLETED</div><div style="font-size:22px;font-weight:800;color:${WHITE};margin-top:5px;">${winner?.lap ?? '—'}</div></td>
</tr></table>
</td></tr>
</table>
</td></tr>

<!-- FINAL STANDINGS — every team, winner included -->
<tr><td style="padding:0 34px 28px;">
<div style="font-size:16px;font-weight:900;font-style:italic;color:${GOLD};padding:0 4px 9px;">FINAL STANDINGS</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};background:${PANEL};">
<tr style="background:${PANEL_2};"><td style="padding:8px;font-size:10px;color:${MUTED};">POS</td><td style="padding:8px;font-size:10px;color:${MUTED};">TEAM</td><td align="right" style="padding:8px;font-size:10px;color:${MUTED};">TOTAL KM</td><td align="right" style="padding:8px;font-size:10px;color:${MUTED};">GAP</td></tr>
${standingsRows}
</table>
</td></tr>

<!-- WEEKLY TARGET CHAMPIONS — list on the left, banner image alongside -->
<tr><td style="padding:0 34px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${GOLD_DARK};background:${PANEL};">
<tr><td colspan="2" style="padding:19px 24px 7px;">
<div style="font-size:21px;font-weight:900;font-style:italic;color:${GOLD};">WEEKLY TARGET CHAMPIONS</div>
<div style="font-size:12px;font-weight:800;font-style:italic;color:${WHITE};margin-top:3px;">NEVER GIVE UP!</div>
</td></tr>
<tr>
<td width="60%" valign="top" style="padding:5px 10px 20px 24px;">
${weeklyRows}
<div style="text-align:center;color:${GOLD};font-size:11px;font-weight:800;line-height:16px;margin-top:14px;">${weeklyWinners.length} WEEKS. ${weeklyWinners.length} BATTLES. ${weeklyWinners.length} CHAMPIONS.<br>ONE COMMUNITY.</div>
</td>
<td width="40%" valign="middle" align="center" style="padding:8px 24px 20px 10px;">
<img src="${championsUrl}" width="${podiumWidth}" height="${podiumHeight}" alt="Weekly Target Champions podium" style="display:block;width:100%;max-width:${podiumWidth}px;height:auto;border:0;">
</td>
</tr>
</table>
</td></tr>

<!-- CLOSING -->
<tr><td align="center" style="padding:21px 34px 30px;border-top:1px solid ${BORDER};">
<div style="font-size:14px;line-height:22px;color:${WHITE};">
WE SAW PASSION IN EVERY PEDAL.<br>
WE SAW EFFORT IN EVERY KILOMETRE.<br>
WE SAW SWEAT, DISCIPLINE AND HEART IN EVERY TEAM.
</div>
<div style="font-size:17px;font-weight:900;font-style:italic;color:${GOLD};margin-top:17px;">ON THE PODIUM THERE MAY BE ONE,</div>
<div style="font-size:25px;font-weight:900;font-style:italic;color:${GOLD};margin-top:2px;">BUT ALL OF YOU ARE WINNERS.</div>
<div style="font-size:13px;line-height:21px;color:${MUTED};margin-top:18px;">Thank you for being part of this journey.<br>This is not the end. This is fuel for what's next.</div>
<div style="font-size:17px;font-weight:900;font-style:italic;color:${GOLD};margin-top:11px;">KEEP PEDALING. KEEP CHASING. KEEP DREAMING.</div>
<div style="font-size:13px;line-height:21px;color:${WHITE};margin-top:14px;">THE RACE IS OVER. THE GLORY IS YOURS.<br><strong style="color:${GOLD};">BUT THE HUNGER NEVER STOPS.</strong></div>
</td></tr>

<!-- FOOTER -->
<tr><td align="center" style="padding:17px 20px;border-top:1px solid ${BORDER};background:#080a0b;">
<img src="${iconUrl}" width="40" height="40" alt="Callisto" style="display:block;margin:auto;border:0;object-fit:contain;">
<div style="font-size:17px;font-weight:800;color:${GOLD_DARK};margin-top:6px;">CALLISTO</div>
<div style="font-size:10px;color:${MUTED};letter-spacing:1px;margin-top:3px;">THE JOURNEY HAS ENDED. GLORY REMAINS.</div>
</td></tr>

</table>
</td></tr></table>
</body></html>`
}
