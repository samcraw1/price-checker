import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { PageHeader } from '../shell/PageHeader'
import { LoadingState, ErrorMessage } from '../components/Feedback'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

type PriceTrackerSummary = {
  listingCount: number
  recentChangeCount: number
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
  const [summary, setSummary] = useState<PriceTrackerSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const listings = await api.fetchListings()
        const histories = await Promise.all(
          listings.map((listing) => api.fetchHistory(listing.id).catch(() => []))
        )
        const now = Date.now()
        const recentChangeCount = histories
          .flat()
          .filter((entry) => now - new Date(entry.checked_at).getTime() < SEVEN_DAYS_MS).length

        if (!cancelled) {
          setSummary({ listingCount: listings.length, recentChangeCount })
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
          <SummaryCard label="Active applications" value="—" to="/applications" hint="Not tracked yet" />
          <SummaryCard label="Projects in progress" value="—" to="/projects" hint="Not tracked yet" />
          <SummaryCard label="Videos in production" value="—" to="/videos" hint="Not tracked yet" />
          <SummaryCard label="Notes created" value="—" to="/notes" hint="Not tracked yet" />
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
