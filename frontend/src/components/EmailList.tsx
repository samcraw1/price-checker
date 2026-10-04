import type { Email } from '../types'
import { EmailRow } from './EmailRow'

type Props = {
    emails: Email[]
    onSelect: (id: string) => void
}

export function EmailList({ emails, onSelect }: Props) {
    return (
        <div>
            {emails.map(e => (
                <EmailRow key={e.id} email={e} onSelect={() => onSelect(e.id)} />
            ))}
        </div>
    )
}