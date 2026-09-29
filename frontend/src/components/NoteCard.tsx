import { useState } from 'react'
import type { Note } from '../types'
import { ConfirmDialog } from './ConfirmDialog'

type NoteCardProps = {
  note: Note
  pending: boolean
  onDelete: () => void
  onSaveEdit: (title: string, body: string) => void
}

export function NoteCard({ note, pending, onDelete, onSaveEdit }: NoteCardProps) {
  const [editing, setEditing] = useState(false)
  const [titleInput, setTitleInput] = useState(note.title)
  const [bodyInput, setBodyInput] = useState(note.body)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function startEdit() {
    setTitleInput(note.title)
    setBodyInput(note.body)
    setEditing(true)
  }

  function saveEdit() {
    if (!titleInput.trim() || !bodyInput.trim()) return
    onSaveEdit(titleInput.trim(), bodyInput.trim())
    setEditing(false)
  }

  return (
    <li className="listing">
      <div className="listing-info">
        {editing ? (
          <>
            <label className="sr-only" htmlFor={`note-title-${note.id}`}>
              Title
            </label>
            <input
              id={`note-title-${note.id}`}
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />

            <label className="sr-only" htmlFor={`note-body-${note.id}`}>
              Body
            </label>
            <textarea
              id={`note-body-${note.id}`}
              value={bodyInput}
              onChange={(e) => setBodyInput(e.target.value)}
              rows={4}
            />

            <span className="edit-price">
              <button type="button" onClick={saveEdit}>
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </span>
          </>
        ) : (
          <>
            <button type="button" className="price-button" onClick={startEdit}>
              {note.title}
              <span className="sr-only"> — click to edit</span>
            </button>
            <p className="listing-meta">{note.body}</p>
            <p className="listing-meta">Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
          </>
        )}
      </div>

      <div className="listing-actions">
        <button type="button" onClick={() => setConfirmingDelete(true)} disabled={pending}>
          Delete
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this note?"
          message={`"${note.title}" will be removed. This can't be undone.`}
          confirmLabel="Delete"
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false)
            onDelete()
          }}
        />
      )}
    </li>
  )
}
