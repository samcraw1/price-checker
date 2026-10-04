import { useEffect, useState } from 'react'
import type { Email } from './types'
import { EmailList } from './components/EmailList'
import { EmailViewer } from './components/EmailViewer'
import { ConnectGmailButton } from './components/ConnectGmailButton'
import { LoadingState, ErrorMessage } from './components/Feedback'
import { MOCK_EMAILS } from './mockEmails'
import * as api from './api'

export function EmailDashboard() {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsAuth, setNeedsAuth] = useState(false)
  const [body, setBody] = useState<Email | null>(null)
  const [loadingBody, setLoadingBody] = useState(false)
  const [bodyError, setBodyError] = useState<string | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api.fetchEmails()
      .then(setEmails)
      .catch((e) => {
        if (e instanceof api.ApiError && e.status === 401) setNeedsAuth(true)
        else setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [refreshKey])

  useEffect(() => {
    if (!selectedId) {
      setBody(null)
      setBodyError(null)
      return
    }
    setLoadingBody(true)
    setBodyError(null)
    api.fetchEmail(selectedId)
      .then(setBody)
      .catch((e) => setBodyError(e.message))
      .finally(() => setLoadingBody(false))
  }, [selectedId])

  const selected = emails.find((e) => e.id === selectedId) ?? null
  // Full email once loaded; the list's version (snippet/preview) until then.
  const shown = body?.id === selectedId ? body : selected

  return (
    <>
      <button type="button" className="email-refresh" onClick={() => setRefreshKey((k) => k + 1)}>
        Refresh
      </button>
      {needsAuth && <ConnectGmailButton />}
      {loading && <LoadingState />}
      {error && <ErrorMessage message={error} />}
      <div className="email-layout">
        <EmailList emails={emails} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="email-viewer-wrap">
          {loadingBody && <LoadingState />}
          {bodyError && <ErrorMessage message={bodyError} />}
          <EmailViewer email={shown} onClose={() => setSelectedId(null)} />
        </div>
      </div>
    </>
  )
}
