import { useState } from 'react'
import type { Email } from './types'
import { EmailList } from './components/EmailList'
import { EmailViewer } from './components/EmailViewer'
import { ConnectGmailButton } from './components/ConnectGmailButton'

export function EmailDashboard() {
  const [emails] = useState<Email[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = emails.find((e) => e.id === selectedId) ?? null

  return (
    <>
      <ConnectGmailButton />
      <div className="email-layout">
        <EmailList emails={emails} selectedId={selectedId} onSelect={setSelectedId} />
        <EmailViewer email={selected} onClose={() => setSelectedId(null)} />
      </div>
    </>
  )
}
