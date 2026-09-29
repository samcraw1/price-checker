import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { PageHeader } from '../shell/PageHeader'
import { LoadingState, ErrorMessage } from '../components/Feedback'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
const VIDEO_IN_PRODUCTION_STATUSES = new Set(['Planning', 'Recording', 'Editing'])

type Summary = {
  listingCount: number
  recentChangeCount: number
  activeApplicationCount: number
  projectsInProgressCount: number
  videosInProductionCount: number
  noteCount: number
}

function SummaryCard({
  label,
  value,
  to,
  hint,
}: {
  label: string
  value: string
  to: string
  hint?: string
}) {
  return (
    <Link to={to} className="summary-card">
      <span className="summary-card-label">{label}</span>
      <span className="summary-card-value">{value}</span>
      {hint && <span className="summary-card-hint">{hint}</span>}
    </Link>
  )
}

export function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [listings, applications, projects, videos, notes] = await Promise.all([
          api.fetchListings(),
          api.fetchApplications(),
          api.fetchProjects(),
          api.fetchVideos(),
          api.fetchNotes(),
        ])

        const histories = await Promise.all(
          listings.map((listing) => api.fetchHistory(listing.id).catch(() => []))
        )
        const now = Date.now()
        const recentChangeCount = histories
          .flat()
          .filter((entry) => now - new Date(entry.checked_at).getTime() < SEVEN_DAYS_MS).length

        if (!cancelled) {
          setSummary({
            listingCount: listings.length,
            recentChangeCount,
            activeApplicationCount: applications.filter((a) => a.status !== 'Rejected').length,
            projectsInProgressCount: projects.filter((p) => p.status === 'In progress').length,
            videosInProductionCount: videos.filter((v) => VIDEO_IN_PRODUCTION_STATUSES.has(v.status)).length,
            noteCount: notes.length,
          })
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of everything in your Personal app." />

      {loading && <LoadingState label="Loading overview…" />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="summary-grid">
          <SummaryCard
            label="Active applications"
            value={String(summary?.activeApplicationCount ?? 0)}
            to="/applications"
          />
          <SummaryCard
            label="Projects in progress"
            value={String(summary?.projectsInProgressCount ?? 0)}
            to="/projects"
          />
          <SummaryCard
            label="Videos in production"
            value={String(summary?.videosInProductionCount ?? 0)}
            to="/videos"
          />
          <SummaryCard label="Notes created" value={String(summary?.noteCount ?? 0)} to="/notes" />
          <SummaryCard
            label="Products being tracked"
            value={String(summary?.listingCount ?? 0)}
            to="/price-tracker"
          />
          <SummaryCard
            label="Recent price changes"
            value={String(summary?.recentChangeCount ?? 0)}
            to="/price-tracker"
            hint="Last 7 days"
          />
        </div>
      )}
    </>
  )
}
