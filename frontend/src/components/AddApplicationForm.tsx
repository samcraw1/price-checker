import { useState, type SubmitEvent } from 'react'
import type { NewApplication } from '../types'
import { APPLICATION_STATUSES } from '../types'

type AddApplicationFormProps = {
  onAdd: (payload: NewApplication) => Promise<void>
  submitting: boolean
}

const initialFormState = {
  company: '',
  role: '',
  status: APPLICATION_STATUSES[0] as string,
  dateApplied: '',
  notes: '',
}

export function AddApplicationForm({ onAdd, submitting }: AddApplicationFormProps) {
  const [form, setForm] = useState(initialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.company.trim() || !form.role.trim() || !form.dateApplied) {
      setValidationError('Company, role, and date applied are required.')
      return
    }

    setValidationError(null)
    await onAdd({
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status,
      dateApplied: form.dateApplied,
      notes: form.notes.trim() || undefined,
    })
    setForm(initialFormState)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} aria-label="Add a job application">
      <div className="field">
        <label htmlFor="app-company">Company</label>
        <input
          id="app-company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="app-role">Role</label>
        <input id="app-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
      </div>

      <div className="field">
        <label htmlFor="app-status">Status</label>
        <select
          id="app-status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="app-date">Date applied</label>
        <input
          id="app-date"
          type="date"
          value={form.dateApplied}
          onChange={(e) => setForm({ ...form, dateApplied: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="app-notes">Notes (optional)</label>
        <textarea
          id="app-notes"
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
        {submitting ? 'Adding…' : 'Add application'}
      </button>
    </form>
  )
}
