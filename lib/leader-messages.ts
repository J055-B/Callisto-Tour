// Rotating "new leader" hype lines for LeaderChangeCelebration.tsx — split
// around "{team}" so the team code can be rendered as its own styled
// element (yellow + shimmer, since it's the important part of the message)
// instead of plain interpolated text. Keep this list long enough that it
// doesn't feel repetitive over a 3-week Tour; add more any time.
export const LEADER_CHANGE_MESSAGES: string[] = [
  'Leaving rivals in the dust — {team} takes the lead!',
  'Pedal to the medal — {team} takes the lead!',
  'Fast and furious — {team} takes the lead!',
  'Nobody saw it coming — {team} takes the lead!',
  'To infinity and beyond — {team} takes the lead!',
  'New leader, who dis? — {team} takes the lead!',
  'History in the making — {team} takes the lead!',
  'The chase is on — {team} takes the lead!',
  'Full throttle, no brakes — {team} takes the lead!',
  'A statement ride — {team} takes the lead!',
  'The gap just flipped — {team} takes the lead!',
  'Written in gold — {team} takes the lead!',
  "That's how legends are made — {team} takes the lead!",
  'Hold on to your helmets — {team} takes the lead!'
]

export interface LeaderMessageParts {
  before: string
  after: string
}

// Picks a random template and splits it around "{team}" — the caller
// renders `before + <styled team code> + after`.
export function randomLeaderMessageParts(): LeaderMessageParts {
  const template = LEADER_CHANGE_MESSAGES[Math.floor(Math.random() * LEADER_CHANGE_MESSAGES.length)]
  const [before, after] = template.split('{team}')
  return { before, after }
}
