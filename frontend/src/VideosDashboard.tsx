import { useEffect, useState } from 'react'
import type { Video, NewVideo, VideoStatus } from './types'
import * as api from './api'
import { AddVideoForm } from './components/AddVideoForm'
import { VideoCard } from './components/VideoCard'
import { LoadingState, EmptyState, ErrorMessage, SuccessMessage } from './components/Feedback'

export function VideosDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
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
      setVideos(await api.fetchVideos())
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

  async function handleAdd(payload: NewVideo) {
    setAddSubmitting(true)
    setError(null)
    try {
      await api.addVideo(payload)
      setSuccessMessage('Video added.')
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
        await api.deleteVideo(id)
        setVideos((prev) => prev.filter((v) => v.id !== id))
        setSuccessMessage('Video removed.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  function handleSaveStatus(id: number, status: VideoStatus) {
    setError(null)
    return withPending(id, async () => {
      try {
        const updated = await api.updateVideo(id, { status })
        setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)))
        setSuccessMessage('Status updated.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  return (
    <>
      <AddVideoForm onAdd={handleAdd} submitting={addSubmitting} />

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      {loading ? (
        <LoadingState label="Loading your videos…" />
      ) : videos.length === 0 ? (
        <EmptyState>No videos planned yet.</EmptyState>
      ) : (
        <ul className="listings">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              pending={pendingIds.has(video.id)}
              onDelete={() => handleDelete(video.id)}
              onSaveStatus={(status) => handleSaveStatus(video.id, status)}
            />
          ))}
        </ul>
      )}
    </>
  )
}
