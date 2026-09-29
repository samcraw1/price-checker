import { useState } from 'react'
import type { Video, VideoStatus } from '../types'
import { VIDEO_STATUSES } from '../types'
import { ConfirmDialog } from './ConfirmDialog'

type VideoCardProps = {
  video: Video
  pending: boolean
  onDelete: () => void
  onSaveStatus: (status: VideoStatus) => void
}

export function VideoCard({ video, pending, onDelete, onSaveStatus }: VideoCardProps) {
  const [editingStatus, setEditingStatus] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <li className="listing">
      <div className="listing-info">
        <span>{video.title}</span>

        <div className="listing-price-row">
          {editingStatus ? (
            <span className="edit-price">
              <label className="sr-only" htmlFor={`video-status-${video.id}`}>
                Status for {video.title}
              </label>
              <select
                id={`video-status-${video.id}`}
                defaultValue={video.status}
                onChange={(e) => {
                  onSaveStatus(e.target.value as VideoStatus)
                  setEditingStatus(false)
                }}
              >
                {VIDEO_STATUSES.map((status) => (
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
              <span className="badge badge-neutral">{video.status}</span>
              <span className="sr-only"> — click to change status</span>
            </button>
          )}
        </div>

        {video.notes && <p className="listing-meta">{video.notes}</p>}
      </div>

      <div className="listing-actions">
        <button type="button" onClick={() => setConfirmingDelete(true)} disabled={pending}>
          Delete
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this video?"
          message={`"${video.title}" will be removed. This can't be undone.`}
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
