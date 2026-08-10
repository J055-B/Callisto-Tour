'use client'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { ENTRANCE_THEME, PLAYLIST } from '../../lib/music'

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

type Phase = 'idle' | 'intro' | 'shuffle'

// Lives in the ROOT layout (app/layout.tsx, not the (app) group's layout)
// so the <audio> element never unmounts crossing from the intro screen
// (route "/") into the dashboard — that's what lets the entrance theme
// keep playing straight through the ENTER click instead of cutting off.
//
// Flow: first click anywhere unlocks audio (browsers block autoplay with
// sound until a real user gesture) and starts the entrance theme, looping
// while still on "/". Once the person navigates away, the loop is turned
// off so the CURRENT play-through finishes naturally, then it hands off to
// a shuffled playlist. Logging out back to "/" later does NOT replay the
// entrance theme — that one-time "welcome" moment only happens once per
// session, so it doesn't feel repetitive.
export default function MusicPlayer() {
  const pathname = usePathname()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [playing, setPlaying] = useState(false)

  const queueRef = useRef<string[]>([])
  const historyRef = useRef<string[]>([])
  const startedRef = useRef(false)
  const enteredRef = useRef(false)

  useEffect(() => {
    if (pathname !== '/') enteredRef.current = true
    if (phase === 'intro' && enteredRef.current && audioRef.current) {
      audioRef.current.loop = false
    }
  }, [pathname, phase])

  function nextFromQueue(): string {
    if (queueRef.current.length === 0) queueRef.current = shuffle(PLAYLIST)
    return queueRef.current.shift() as string
  }

  function playTrack(src: string, opts: { loop?: boolean } = {}) {
    const audio = audioRef.current
    if (!audio) return
    audio.src = src
    audio.loop = !!opts.loop
    audio.play().catch(() => {})
    setPlaying(true)
  }

  function startShuffleTrack() {
    setPhase('shuffle')
    playTrack(nextFromQueue())
  }

  function startEntrance() {
    startedRef.current = true
    setPhase('intro')
    playTrack(ENTRANCE_THEME, { loop: !enteredRef.current })
  }

  // First-ever click anywhere on the page unlocks audio.
  useEffect(() => {
    if (phase !== 'idle') return
    function unlock() {
      if (startedRef.current) return
      startEntrance()
      document.removeEventListener('click', unlock, true)
    }
    document.addEventListener('click', unlock, true)
    return () => document.removeEventListener('click', unlock, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function handleEnded() {
    startShuffleTrack()
  }

  function togglePlay() {
    const audio = audioRef.current
    if (phase === 'idle' || !audio) {
      startEntrance()
      return
    }
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  function handleNext() {
    if (phase === 'idle') return
    if (audioRef.current?.src) historyRef.current.push(audioRef.current.src)
    startShuffleTrack()
  }

  function handlePrevious() {
    if (phase !== 'shuffle') return
    const prev = historyRef.current.pop()
    if (prev) playTrack(prev)
    else startShuffleTrack()
  }

  const controlsEnabled = phase !== 'idle'

  return (
    <>
      <audio ref={audioRef} onEnded={handleEnded} />
      <div className="fixed bottom-4 right-4 z-[1500] flex items-center gap-1 bg-elevated/90 backdrop-blur-sm border border-border rounded-full px-2 py-1.5 shadow-lg">
        <button
          onClick={handlePrevious}
          disabled={phase !== 'shuffle'}
          className="w-8 h-8 flex items-center justify-center rounded-full text-secondaryText hover:text-yellow hover:bg-yellow/10 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondaryText"
          aria-label="Previous track"
        >
          <SkipBack size={15} />
        </button>
        <button
          onClick={togglePlay}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow text-black hover:brightness-95 transition"
          aria-label={playing ? 'Pause music' : 'Play music'}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={handleNext}
          disabled={!controlsEnabled}
          className="w-8 h-8 flex items-center justify-center rounded-full text-secondaryText hover:text-yellow hover:bg-yellow/10 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondaryText"
          aria-label="Next track"
        >
          <SkipForward size={15} />
        </button>
      </div>
    </>
  )
}
