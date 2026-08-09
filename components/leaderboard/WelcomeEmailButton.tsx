'use client'
import React, { useEffect, useState } from 'react'
import { Mail, X, Copy, Check } from 'lucide-react'
import { getRole, ROLE_CHANGED_EVENT } from '../../lib/session'
import { WELCOME_EMAIL_HTML, WELCOME_EMAIL_SUBJECT } from '../../lib/welcome-email'

// Admin-only: opens a preview of the Tour's welcome/kickoff email (styled to
// match the app) and copies it as real HTML — pasting into Gmail keeps the
// colors/layout instead of dumping plain text, since the clipboard write
// includes a text/html entry alongside the text/plain fallback.
export default function WelcomeEmailButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

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

  async function copyEmail() {
    try {
      const item = new ClipboardItem({
        'text/html': new Blob([WELCOME_EMAIL_HTML], { type: 'text/html' }),
        'text/plain': new Blob(['Tour de Callisto — open this in a browser to copy the formatted version.'], { type: 'text/plain' })
      })
      await navigator.clipboard.write([item])
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Some browsers block ClipboardItem outside a few narrow contexts —
      // fall back to plain HTML source, still pasteable, just not "rich".
      try {
        await navigator.clipboard.writeText(WELCOME_EMAIL_HTML)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        // Give up quietly — the preview is still on-screen to copy by hand.
      }
    }
  }

  if (!isAdmin) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-bold text-secondaryText border border-border hover:text-yellow hover:border-yellow transition"
        title="Generate the Tour welcome email"
      >
        <Mail size={13} />
        WELCOME EMAIL
      </button>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[88vh] rounded-lg app-surface border border-border flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div>
                <div className="text-sm font-bold">Welcome email preview</div>
                <div className="text-xs text-secondaryText mt-0.5">Subject: {WELCOME_EMAIL_SUBJECT}</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-secondaryText hover:text-primaryText" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#e9e9e9]">
              <iframe title="Welcome email preview" srcDoc={WELCOME_EMAIL_HTML} className="w-full border-0" style={{ height: '900px' }} />
            </div>

            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border shrink-0">
              <span className="text-xs text-secondaryText">Copies as real formatting — paste straight into a Gmail draft.</span>
              <button
                onClick={copyEmail}
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition ' +
                  (copied ? 'bg-positive text-black' : 'bg-yellow text-black hover:brightness-95')
                }
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied!' : 'Copy email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
