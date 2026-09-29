import { useState, type SubmitEvent } from 'react'
import type { NewProject } from '../types'
import { PROJECT_STATUSES } from '../types'

type AddProjectFormProps = {
  onAdd: (payload: NewProject) => Promise<void>
  submitting: boolean
}

const initialFormState = {
  title: '',
  description: '',
  technologies: '',
  status: PROJECT_STATUSES[0] as string,
  repository: '',
  deploymentUrl: '',
  notes: '',
}

export function AddProjectForm({ onAdd, submitting }: AddProjectFormProps) {
  const [form, setForm] = useState(initialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.title.trim() || !form.description.trim()) {
      setValidationError('Title and description are required.')
      return
    }

    setValidationError(null)
    await onAdd({
      title: form.title.trim(),
      description: form.description.trim(),
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      status: form.status,
      repository: form.repository.trim() || undefined,
      deploymentUrl: form.deploymentUrl.trim() || undefined,
      notes: form.notes.trim() || undefined,
    })
    setForm(initialFormState)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} aria-label="Add a project">
      <div className="field">
        <label htmlFor="project-title">Title</label>
        <input
          id="project-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="project-status">Status</label>
        <select
          id="project-status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="project-description">Description</label>
        <textarea
          id="project-description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="field">
        <label htmlFor="project-tech">Technologies (comma-separated)</label>
        <input
          id="project-tech"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          placeholder="TypeScript, React, Postgres"
        />
      </div>

      <div className="field">
        <label htmlFor="project-repo">Repository URL (optional)</label>
        <input
          id="project-repo"
          type="url"
          value={form.repository}
          onChange={(e) => setForm({ ...form, repository: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="project-deploy">Deployment URL (optional)</label>
        <input
          id="project-deploy"
          type="url"
          value={form.deploymentUrl}
          onChange={(e) => setForm({ ...form, deploymentUrl: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="project-notes">Notes (optional)</label>
        <textarea
          id="project-notes"
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
        {submitting ? 'Adding…' : 'Add project'}
      </button>
    </form>
  )
}
