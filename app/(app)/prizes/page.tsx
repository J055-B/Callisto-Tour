import React from 'react'
import { Trophy, Calendar, Clock, Bike } from 'lucide-react'
import { getTeams, getLeaderboard } from '../../../lib/data-source'
import { computeWeeklyWinners, TOUR_START } from '../../../lib/calculations'
import EditableText from '../../../components/layout/EditableText'

export const dynamic = 'force-dynamic'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

// Same icon-badge + title + fading gradient underline treatment as the
// /leaderboard page's sections, so both pages read as one family.
function SectionHeader({ icon, accent, title, subtitle }: { icon: React.ReactNode; accent: string; title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}1F`, border: `1px solid ${accent}59` }}>
          {icon}
        </span>
        <div>
          <div className="text-lg font-bold tracking-wide">{title}</div>
          <div className="text-xs text-secondaryText mt-0.5">{subtitle}</div>
        </div>
      </div>
      <div className="h-0.5 mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent}26 40%, transparent 75%)` }} />
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-3.5 my-7">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
      <span className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center shrink-0 text-secondaryText">
        <Bike size={15} />
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
    </div>
  )
}

export default async function PrizesPage() {
  const [teams, leaderboard] = await Promise.all([getTeams(), getLeaderboard()])
  // Newest week first — this week's winner (or in-progress leader) always
  // shows up top, last week gets pushed down, etc.
  const weeklyWinners = [...computeWeeklyWinners(teams)].reverse()
  const leader = leaderboard[0]
  const todayStr = new Date().toISOString().slice(0, 10)
  const tourStarted = todayStr >= TOUR_START
  const tourEnded = todayStr > '2026-08-31'

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Prizes</h1>

      {/* TOUR CHAMPION — full width, top */}
      <div className="p-4 app-surface rounded-lg border border-border">
        <SectionHeader
          icon={<Trophy size={16} color="#FFD400" />}
          accent="#FFD400"
          title={<EditableText contentKey="prizes.tourChampion.title" />}
          subtitle={<EditableText contentKey="prizes.tourChampion.subtitle" />}
        />
        {!tourStarted || !leader ? (
          <p className="text-secondaryText">Details TBA.</p>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <span
                className={
                  'px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ' +
                  (tourEnded ? 'bg-yellow text-black' : 'bg-elevated border border-border text-secondaryText')
                }
              >
                {tourEnded ? 'CHAMPION' : 'PROVISIONAL LEADER'}
              </span>
              {!tourEnded && <span className="text-[10px] text-secondaryText">Tour ends 31 Aug — this can still change</span>}
            </div>
            <div className="text-xl font-bold mt-2">{leader.teamCode}</div>
            <div className="text-sm text-secondaryText">{Math.round(leader.totalDistance).toLocaleString()} km total</div>
          </div>
        )}
      </div>

      <SectionDivider />

      {/* WEEKLY WINNER — most recent week first */}
      <div className="p-4 app-surface rounded-lg border border-border">
        <SectionHeader
          icon={<Calendar size={16} color="#2DD4BF" />}
          accent="#2DD4BF"
          title={<EditableText contentKey="prizes.weeklyWinner.title" />}
          subtitle={<EditableText contentKey="prizes.weeklyWinner.subtitle" multiline />}
        />

        <div className="space-y-2">
          {weeklyWinners.map((w) => (
            <div key={w.weekIndex} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2.5">
              <div>
                <div className="text-sm font-bold">
                  {w.weekLabel} <span className="text-secondaryText font-normal">({formatDate(w.start)} – {formatDate(w.end)})</span>
                </div>
                {w.status === 'upcoming' && <div className="text-xs text-secondaryText mt-0.5">Not started yet</div>}
                {w.status === 'in-progress' && (
                  <div className="text-xs text-electric mt-0.5 flex items-center gap-1">
                    <Clock size={11} /> Still running — leader can change
                  </div>
                )}
              </div>
              <div className="text-right">
                {w.winner ? (
                  <>
                    <div className={'font-bold ' + (w.status === 'completed' ? 'text-yellow' : 'text-secondaryText')}>{w.winner.teamCode}</div>
                    <div className="text-xs text-secondaryText">{Math.round(w.winner.weeklyDistance).toLocaleString()} km</div>
                  </>
                ) : (
                  <div className="text-secondaryText text-sm">—</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
