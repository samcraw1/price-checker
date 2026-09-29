import { useState, type SubmitEvent } from 'react'
import type { NewVideo, VideoStatus } from '../types'
import { VIDEO_STATUSES } from '../types'

type AddVideoFormProps = {
  onAdd: (payload: NewVideo) => Promise<void>
  submitting: boolean
}

const initialFormState = {
  title: '',
  status: VIDEO_STATUSES[0] as VideoStatus,
  notes: '',
}

export function AddVideoForm({ onAdd, submitting }: AddVideoFormProps) {
  const [form, setForm] = useState(initialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.title.trim()) {
      setValidationError('Title is required.')
      return
    }

    setValidationError(null)
    await onAdd({
      title: form.title.trim(),
      status: form.status,
      notes: form.notes.trim() || undefined,
    })
    setForm(initialFormState)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} aria-label="Add a video">
      <div className="field">
        <label htmlFor="video-title">Title</label>
        <input
          id="video-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="video-status">Status</label>
        <select
          id="video-status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as VideoStatus })}
        >
          {VIDEO_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="video-notes">Notes (optional)</label>
        <textarea
          id="video-notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />
      </div>

      {validationError && (
        <p className="feedback error" role="alert">
          {validationError}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add video'}
      </button>
    </form>
  )
}
