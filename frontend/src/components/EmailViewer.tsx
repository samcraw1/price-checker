import type { Email } from '../types'

type EmailViewerProps = {
    email: Email | null
    onClose?: () => void
}

export function EmailViewer({ email, onClose }: EmailViewerProps) {
    if (!email) return <div>Select an email</div>

    return (
        <div>
            <h2>{email.subject}</h2>
            <div>From: {email.sentFrom}</div>
            <div>To: {email.sentTo}</div>
            {email.cc && <div>Cc: {email.cc}</div>}
            <div>{new Date(email.sentAt).toLocaleString()}</div>
            <iframe sandbox="" srcDoc={email.body} title={email.subject} />
            {onClose && <button onClick={onClose}>Close</button>}
        </div>
    )
}
