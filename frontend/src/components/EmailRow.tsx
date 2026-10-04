import type { Email } from '../types'


type EmailProps = {
        email: Email
        onSelect: () => void
    }

export function EmailRow({ email, onSelect }: EmailProps) {

    return (
        <div>
            {/* Render email details here */}
            <div onClick={onSelect}>
                <strong>{email.sentFrom}</strong> - {email.subject}
            </div>
        </div>
    )
}