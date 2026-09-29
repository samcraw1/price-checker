import { useEffect, useState } from 'react'
import type { Application, NewApplication } from './types'
import * as api from './api'
import { AddApplicationForm } from './components/AddApplicationForm'
import { ApplicationCard } from './components/ApplicationCard'
import { LoadingState, EmptyState, ErrorMessage, SuccessMessage } from './components/Feedback'

export function ApplicationsDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
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
      setApplications(await api.fetchApplications())
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

  async function handleAdd(payload: NewApplication) {
    setAddSubmitting(true)
    setError(null)
    try {
      await api.addApplication(payload)
      setSuccessMessage('Application added.')
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
        await api.deleteApplication(id)
        setApplications((prev) => prev.filter((a) => a.id !== id))
        setSuccessMessage('Application removed.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  function handleSaveStatus(id: number, status: string) {
    setError(null)
    return withPending(id, async () => {
      try {
        const updated = await api.updateApplication(id, { status })
        setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)))
        setSuccessMessage('Status updated.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  return (
    <>
      <AddApplicationForm onAdd={handleAdd} submitting={addSubmitting} />

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      {loading ? (
        <LoadingState label="Loading your applications…" />
      ) : applications.length === 0 ? (
        <EmptyState>No applications added yet.</EmptyState>
      ) : (
        <ul className="listings">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              pending={pendingIds.has(application.id)}
              onDelete={() => handleDelete(application.id)}
              onSaveStatus={(status) => handleSaveStatus(application.id, status)}
            />
          ))}
        </ul>
      )}
    </>
  )
}
