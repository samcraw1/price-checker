import { useEffect, useState } from 'react'
import type { Project, NewProject } from './types'
import * as api from './api'
import { AddProjectForm } from './components/AddProjectForm'
import { ProjectCard } from './components/ProjectCard'
import { LoadingState, EmptyState, ErrorMessage, SuccessMessage } from './components/Feedback'

export function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
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
      setProjects(await api.fetchProjects())
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

  async function handleAdd(payload: NewProject) {
    setAddSubmitting(true)
    setError(null)
    try {
      await api.addProject(payload)
      setSuccessMessage('Project added.')
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
        await api.deleteProject(id)
        setProjects((prev) => prev.filter((p) => p.id !== id))
        setSuccessMessage('Project removed.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  function handleSaveStatus(id: number, status: string) {
    setError(null)
    return withPending(id, async () => {
      try {
        const updated = await api.updateProject(id, { status })
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
        setSuccessMessage('Status updated.')
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  return (
    <>
      <AddProjectForm onAdd={handleAdd} submitting={addSubmitting} />

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      {loading ? (
        <LoadingState label="Loading your projects…" />
      ) : projects.length === 0 ? (
        <EmptyState>No projects added yet.</EmptyState>
      ) : (
        <ul className="listings">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              pending={pendingIds.has(project.id)}
              onDelete={() => handleDelete(project.id)}
              onSaveStatus={(status) => handleSaveStatus(project.id, status)}
            />
          ))}
        </ul>
      )}
    </>
  )
}
