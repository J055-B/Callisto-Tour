'use client'
import React, { useState } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { useSiteContent } from './SiteContentProvider'

// Drop this in place of any plain text — guests see it exactly as before
// (a plain string, no wrapper, no extra DOM), Admin sees a small pencil on
// hover and can click straight into an inline editor. Renders inline
// (a <span>), so it works inside headings/labels/badges without breaking
// their existing styling — the wrapping element keeps its own className.
export default function EditableText({ contentKey, multiline = false }: { contentKey: string; multiline?: boolean }) {
  const { content, isAdmin, updateContent } = useSiteContent()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const value = content[contentKey] ?? ''

  if (!isAdmin) return <>{value}</>

  if (!editing) {
    return (
      <span
        className="group/edit relative inline-flex items-center gap-1.5 cursor-pointer"
        onClick={() => {
          setDraft(value)
          setError('')
          setEditing(true)
        }}
        title="Click to edit"
      >
        {value}
        <Pencil size={12} className="opacity-0 group-hover/edit:opacity-70 text-yellow shrink-0 transition-opacity" />
      </span>
    )
  }

  async function save() {
    if (!draft.trim()) return
    setSaving(true)
    setError('')
    try {
      await updateContent(contentKey, draft)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="bg-elevated border border-yellow rounded px-2 py-1 text-sm text-primaryText min-w-[220px]"
          rows={2}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditing(false)
          }}
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="bg-elevated border border-yellow rounded px-2 py-1 text-inherit font-inherit"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') setEditing(false)
          }}
        />
      )}
      <button onClick={save} disabled={saving} className="text-positive hover:brightness-125 disabled:opacity-50" aria-label="Save">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
      </button>
      <button onClick={() => setEditing(false)} disabled={saving} className="text-negative hover:brightness-125" aria-label="Cancel">
        <X size={16} />
      </button>
      {error && <span className="text-negative text-xs">{error}</span>}
    </span>
  )
}
