import { useState } from 'react'
import type { Email } from './types'
import { EmailList } from './components/EmailList'
import { EmailViewer } from './components/EmailViewer'


export function EmailDashboard() {

    const [emails, setEmails] = useState<Email[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const selected = emails.find(e => e.id === selectedId) ?? null

    return (
        <div style = {{display: 'flex'}}>
            <EmailList emails={emails} onSelect={setSelectedId} />
            <EmailViewer email={selected} />
        </div>
    )
}