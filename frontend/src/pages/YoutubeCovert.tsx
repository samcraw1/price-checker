import { useEffect, useMemo, useState, type SubmitEvent } from 'react'
import { PageHeader } from '../shell/PageHeader'
import { LoadingState, EmptyState, ErrorMessage } from '../components/Feedback'
import { convertYoutubeVideo, fetchYoutubeConversionResult, fetchYoutubeConversions } from '../api'
import type { YoutubeConversion } from '../types'

const POLL_INTERVAL_MS = 2000

export function YoutubeConvert() {
  const [url, setUrl] = useState('')
  const [conversions, setConversions] = useState<YoutubeConversion[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchYoutubeConversions()
      .then(setConversions)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load your YouTube conversion history.'))
      .finally(() => setLoading(false))
  }, [])

  const pendingIds = useMemo(
    () => conversions.filter((c) => c.status === 'pending' || c.status === 'processing').map((c) => c.id),
    [conversions]
  )
  const pendingKey = pendingIds.join(',')

  useEffect(() => {
    if (pendingIds.length === 0) return

    const timer = setInterval(async () => {
      const results = await Promise.allSettled(pendingIds.map((id) => fetchYoutubeConversionResult(id)))
      setConversions((prev) => {
        const updatesById = new Map<number, YoutubeConversion>()
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') updatesById.set(pendingIds[i], r.value)
        })
        if (updatesById.size === 0) return prev
        return prev.map((c) => updatesById.get(c.id) ?? c)
      })
    }, POLL_INTERVAL_MS)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingKey])

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!url.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const result = await convertYoutubeVideo(url.trim())
      setConversions((prev) => [result, ...prev])
      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not convert that YouTube video.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleDownload(item: YoutubeConversion) {
    if (!item.transcript) return

    const blob = new Blob([item.transcript], { type: 'text/plain' })
    const objectUrl = URL.createObjectURL(blob)
    const safeName = item.youtubeName.replace(/[\\/:*?"<>|]/g, '_')

    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `${safeName}.txt`
    link.click()

    URL.revokeObjectURL(objectUrl)
  }

  return (
    <>
      <PageHeader title="YouTube Convert" description="Convert YouTube videos to text transcripts." />

      <form className="add-form youtube-convert-form" onSubmit={handleSubmit} aria-label="Convert a YouTube video to a transcript">
        <div className="field">
          <label htmlFor="youtubeUrl">YouTube video URL</label>
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Convert'}
        </button>
      </form>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingState label="Loading conversion history…" />
      ) : conversions.length === 0 ? (
        <EmptyState>No conversions yet — paste a YouTube URL above to get started.</EmptyState>
      ) : (
        <ul className="youtube-history">
          {conversions.map((item) => {
            const inProgress = item.status === 'pending' || item.status === 'processing'

            return (
              <li key={item.id} className={`youtube-chip youtube-chip-${item.status}`}>
                <a
                  className="youtube-chip-label"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  title={item.youtubeName}
                >
                  {inProgress && <span className="chip-spinner" aria-hidden="true" />}
                  <span className="chip-text">{item.youtubeName || item.url}</span>
                </a>

                {inProgress && (
                  <span className="chip-status-label">{item.status === 'pending' ? 'Queued…' : 'Converting…'}</span>
                )}

                {item.status === 'failed' && (
                  <span className="chip-status-label chip-status-failed" title={item.error ?? 'Conversion failed.'}>
                    Failed
                  </span>
                )}

                <button
                  type="button"
                  className="chip-download"
                  onClick={() => handleDownload(item)}
                  disabled={item.status !== 'complete' || !item.transcript}
                  aria-label={`Download transcript for ${item.youtubeName}`}
                  title="Download as .txt"
                >
                  ⬇
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
