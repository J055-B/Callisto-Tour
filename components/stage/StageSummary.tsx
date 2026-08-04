"use client"
import React, { useEffect, useState } from 'react'

function formatTimeLeft(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function StageSummary({ team }: { team?: any }) {
  const [timeLeft, setTimeLeft] = useState(8 * 3600 * 1000 + 24 * 60 * 1000 + 38 * 1000)

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="rounded-lg p-4 app-surface">
      <h4 className="font-semibold">STAGE SUMMARY</h4>
      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">DAILY TARGET</div>
          <div className="font-bold mt-1">$10,000</div>
        </div>
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">SALES TODAY</div>
          <div className="font-bold mt-1">$8,420</div>
        </div>
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">% OF TARGET</div>
          <div className="font-bold mt-1">84.2%</div>
        </div>
        <div className="p-3 bg-elevated rounded">
          <div className="text-xs text-secondaryText">BOARD CLOSES IN</div>
          <div className="font-bold mt-1">{formatTimeLeft(timeLeft)}</div>
        </div>
      </div>
    </div>
  )
}
