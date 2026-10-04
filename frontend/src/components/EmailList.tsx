import type { Email } from '../types'
import { EmailRow } from './EmailRow'

type EmailListProps = {
  emails: Email[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function EmailList({ emails, selectedId, onSelect }: EmailListProps) {
  return (
    <ul className="email-list">
      {emails.map((e) => (
        <EmailRow
          key={e.id}
          email={e}
          selected={e.id === selectedId}
          onSelect={() => onSelect(e.id)}
        />
      ))}
    </ul>
  )
}
