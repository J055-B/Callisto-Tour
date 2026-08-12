'use client'
import React, { useEffect, useState } from 'react'
import { Mail, X, Copy, Check, RefreshCw } from 'lucide-react'
import { getRole, ROLE_CHANGED_EVENT } from '../../lib/session'
import { buildRaceUpdateEmail, RACE_UPDATE_EMAIL_SUBJECT } from '../../lib/race-update-email'
import { LeaderboardEntry } from '../../lib/types'

// Admin-only: generates a live race-update email from the same leaderboard
// entries already rendered on the page. The generated HTML is copied as rich
// HTML so it can be pasted directly into Gmail/Outlook as a formatted email.
export default function WelcomeEmailButton({ entries }: { entries: LeaderboardEntry[] }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState('')

  useEffect(() => {
    const read = () => setIsAdmin(getRole() === 'admin')
    read()
    window.addEventListener(ROLE_CHANGED_EVENT, read)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener(ROLE_CHANGED_EVENT, read)
      window.removeEventListener('storage', read)
    }
  }, [])

  function generateEmail() {
    const generated = buildRaceUpdateEmail(entries, window.location.origin, new Date())
    setHtml(generated)
    setCopied(false)
  }

  function openModal() {
    generateEmail()
    setOpen(true)
  }

  async function copyEmail() {
    const content = html || buildRaceUpdateEmail(entries, window.location.origin, new Date())
    try {
      const item = new ClipboardItem({
        'text/html': new Blob([content], { type: 'text/html' }),
        'text/plain': new Blob(['Tour de Callisto — Live Race Update'], { type: 'text/plain' })
      })
      await navigator.clipboard.write([item])
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      try {
        await navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        // Keep the preview available if clipboard permissions are denied.
      }
    }
  }

  if (!isAdmin) return null

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-bold text-secondaryText border border-border hover:text-yellow hover:border-yellow transition"
        title="Generate the latest Tour race update email"
      >
        <Mail size={13} />
        RACE UPDATE EMAIL
      </button>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-[1500px] h-[94vh] rounded-lg app-surface border border-border flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Mail size={16} className="text-yellow" />
                  RACE UPDATE EMAIL
                </div>
                <div className="text-xs text-secondaryText mt-0.5">Subject: {RACE_UPDATE_EMAIL_SUBJECT}</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-secondaryText hover:text-primaryText" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 min-h-0 flex bg-[#111517]">
              <div className="flex-1 min-w-0 overflow-auto p-4 bg-[#090D0F]">
                <div className="min-w-[1120px] flex justify-center">
                  {html && (
                    <iframe
                      title="Race update email preview"
                      srcDoc={html}
                      className="w-[1120px] border border-border bg-white"
                      style={{ height: '760px' }}
                    />
                  )}
                </div>
              </div>

              <aside className="w-[300px] shrink-0 border-l border-border bg-[#0B1114] p-5 overflow-y-auto">
                <button
                  onClick={generateEmail}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-yellow text-black font-bold text-sm hover:brightness-95 transition"
                >
                  <RefreshCw size={15} />
                  REGENERATE EMAIL
                </button>

                <div className="mt-5 rounded-lg border border-border bg-[#10181C] p-4">
                  <div className="text-xs font-bold tracking-wider text-yellow">LIVE DATA</div>
                  <p className="text-xs text-secondaryText mt-2 leading-5">
                    The email is generated from the same leaderboard data currently shown on this page. Generate again after the sheet refreshes to capture the latest standings.
                  </p>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-[#10181C] p-4">
                  <div className="text-xs font-bold tracking-wider text-yellow">COPY TO EMAIL</div>
                  <p className="text-xs text-secondaryText mt-2 leading-5">
                    Copy the formatted HTML, open Gmail or Outlook, create a new message, and paste. The tables, colors, layout and typography are preserved as rich content.
                  </p>
                  <button
                    onClick={copyEmail}
                    className={'w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-bold text-sm transition ' + (copied ? 'bg-positive text-black' : 'bg-yellow text-black hover:brightness-95')}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'COPIED!' : 'COPY EMAIL HTML'}
                  </button>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-[#10181C] p-4">
                  <div className="text-xs font-bold tracking-wider text-blue">HOW TO SEND</div>
                  <ol className="text-xs text-secondaryText mt-3 space-y-2 leading-5 list-decimal list-inside">
                    <li>Generate the latest email.</li>
                    <li>Copy Email HTML.</li>
                    <li>Open your mail client.</li>
                    <li>Create a new email.</li>
                    <li>Paste the content.</li>
                    <li>Add recipients and send.</li>
                  </ol>
                </div>
              </aside>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <span className="text-[11px] text-secondaryText">Wide desktop email • generated from current Tour data • no automatic sending</span>
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-border text-xs font-bold hover:border-yellow hover:text-yellow transition">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
