import { useState } from 'react'
import type { Project } from '../types'
import { PROJECT_STATUSES } from '../types'
import { ConfirmDialog } from './ConfirmDialog'

type ProjectCardProps = {
  project: Project
  pending: boolean
  onDelete: () => void
  onSaveStatus: (status: string) => void
}

export function ProjectCard({ project, pending, onDelete, onSaveStatus }: ProjectCardProps) {
  const [editingStatus, setEditingStatus] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const primaryLink = project.deploymentUrl ?? project.repository

  return (
    <li className="listing">
      <div className="listing-info">
        {primaryLink ? (
          <a href={primaryLink} target="_blank" rel="noreferrer">
            {project.title}
          </a>
        ) : (
          <span>{project.title}</span>
        )}

        <p className="listing-meta">{project.description}</p>

        {project.technologies.length > 0 && (
          <div className="listing-price-row">
            {project.technologies.map((tech) => (
              <span key={tech} className="badge badge-neutral">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="listing-price-row">
          {editingStatus ? (
            <span className="edit-price">
              <label className="sr-only" htmlFor={`project-status-${project.id}`}>
                Status for {project.title}
              </label>
              <select
                id={`project-status-${project.id}`}
                defaultValue={project.status}
                onChange={(e) => {
                  onSaveStatus(e.target.value)
                  setEditingStatus(false)
                }}
              >
                {PROJECT_STATUSES.map((status) => (
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
              <span className={project.status === 'Completed' ? 'badge badge-good' : 'badge badge-neutral'}>
                {project.status}
              </span>
              <span className="sr-only"> — click to change status</span>
            </button>
          )}
        </div>

        {(project.repository || project.deploymentUrl) && (
          <p className="listing-meta">
            {project.repository && (
              <a href={project.repository} target="_blank" rel="noreferrer">
                Repository
              </a>
            )}
            {project.repository && project.deploymentUrl && ' · '}
            {project.deploymentUrl && (
              <a href={project.deploymentUrl} target="_blank" rel="noreferrer">
                Live
              </a>
            )}
          </p>
        )}

        {project.notes && <p className="listing-meta">{project.notes}</p>}
      </div>

      <div className="listing-actions">
        <button type="button" onClick={() => setConfirmingDelete(true)} disabled={pending}>
          Delete
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this project?"
          message={`"${project.title}" will be removed. This can't be undone.`}
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
