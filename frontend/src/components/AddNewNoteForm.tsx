import { useState, type SubmitEvent } from 'react'
import type { NewNote } from '../types'

type AddNoteFormProps = {
  onAdd: (payload: NewNote) => Promise<void>
  submitting: boolean
}

const initialFormState = { title: '', body: '' }

export function AddNoteForm({ onAdd, submitting }: AddNoteFormProps) {
  const [form, setForm] = useState(initialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.title.trim() || !form.body.trim()) {
      setValidationError('Title and body are both required.')
      return
    }

    setValidationError(null)
    await onAdd({ title: form.title.trim(), body: form.body.trim() })
    setForm(initialFormState)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} aria-label="Add a note">
      <div className="field">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Idea for..."
        />
      </div>

      <div className="field">
        <label htmlFor="note-body">Body</label>
        <textarea
          id="note-body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={4}
        />
      </div>

      {validationError && (
        <p className="feedback error" role="alert">
          {validationError}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add note'}
      </button>
    </form>
  )
}
