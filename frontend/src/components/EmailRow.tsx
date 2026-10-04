import type { Email } from '../types'

type EmailRowProps = {
  email: Email
  selected: boolean
  onSelect: () => void
}

export function EmailRow({ email, selected, onSelect }: EmailRowProps) {
  return (
    <li>
      <button
        type="button"
        className={`email-row${selected ? ' selected' : ''}`}
        onClick={onSelect}
      >
        <span className="email-row-from">{email.sentFrom}</span>
        <span className="email-row-subject">{email.subject}</span>
        <span className="email-row-snippet">{email.snippet}</span>
        <span className="email-row-date">
          {new Date(email.sentAt).toLocaleDateString()}
        </span>
      </button>
    </li>
  )
}
