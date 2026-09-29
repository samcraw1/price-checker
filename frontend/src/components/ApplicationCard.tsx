import { useState } from 'react'
import type { Application } from '../types'
import { APPLICATION_STATUSES } from '../types'
import { ConfirmDialog } from './ConfirmDialog'

type ApplicationCardProps = {
  application: Application
  pending: boolean
  onDelete: () => void
  onSaveStatus: (status: string) => void
}

export function ApplicationCard({ application, pending, onDelete, onSaveStatus }: ApplicationCardProps) {
  const [editingStatus, setEditingStatus] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <li className="listing">
      <div className="listing-info">
        <span>
          {application.company} — {application.role}
        </span>

        <div className="listing-price-row">
          {editingStatus ? (
            <span className="edit-price">
              <label className="sr-only" htmlFor={`app-status-${application.id}`}>
                Status for {application.company}
              </label>
              <select
                id={`app-status-${application.id}`}
                defaultValue={application.status}
                onChange={(e) => {
                  onSaveStatus(e.target.value)
                  setEditingStatus(false)
                }}
              >
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => setEditingStatus(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <button type="button" className="price-button" onClick={() => setEditingStatus(true)}>
              <span className="badge badge-neutral">{application.status}</span>
              <span className="sr-only"> — click to change status</span>
            </button>
          )}
        </div>

        <p className="listing-meta">Applied: {new Date(application.dateApplied).toLocaleDateString()}</p>
        <p className="listing-meta">Last updated: {new Date(application.lastUpdated).toLocaleString()}</p>
        {application.notes && <p className="listing-meta">{application.notes}</p>}
      </div>

      <div className="listing-actions">
        <button type="button" onClick={() => setConfirmingDelete(true)} disabled={pending}>
          Delete
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this application?"
          message={`"${application.company} — ${application.role}" will be removed. This can't be undone.`}
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
