import { useEffect, useState } from 'react'
import type { Note, NewNote } from './types'
import * as api from './api'
import { AddNoteForm } from './components/AddNewNoteForm'
import { NoteCard } from './components/NoteCard'
import { LoadingState, EmptyState, ErrorMessage, SuccessMessage } from './components/Feedback'

export function NotesDashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())
  const [addSubmitting, setAddSubmitting] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => setSuccessMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [successMessage])

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      setNotes(await api.fetchNotes())
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function withPending(id: number, fn: () => Promise<void>) {
    setPendingIds((prev) => new Set(prev).add(id))
    return fn().finally(() => {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    })
  }

  async function handleAdd(payload: NewNote) {
    setAddSubmitting(true)
    setError(null)
    try {
      await api.addNote(payload)
      setSuccessMessage('Note added.')
      await loadAll()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setAddSubmitting(false)
    }
  }

  function handleDelete(id: number) {
    setError(null)
    return withPending(id, async () => {
      try {
        await api.deleteNote(id)
        setNotes((prev) => prev.filter((n) => n.id !== id))
        setSuccessMessage('Note removed.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  function handleSaveEdit(id: number, title: string, body: string) {
    setError(null)
    return withPending(id, async () => {
      try {
        const updated = await api.updateNote(id, { title, body })
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
        setSuccessMessage('Note updated.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  return (
    <>
      <AddNoteForm onAdd={handleAdd} submitting={addSubmitting} />

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      {loading ? (
        <LoadingState label="Loading your notes…" />
      ) : notes.length === 0 ? (
        <EmptyState>No notes created yet.</EmptyState>
      ) : (
        <ul className="listings">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              pending={pendingIds.has(note.id)}
              onDelete={() => handleDelete(note.id)}
              onSaveEdit={(title, body) => handleSaveEdit(note.id, title, body)}
            />
          ))}
        </ul>
      )}
    </>
  )
}
