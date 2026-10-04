import type { Email } from '../types'

type EmailViewerProps = {
  email: Email | null
  onClose?: () => void
}

export function EmailViewer({ email, onClose }: EmailViewerProps) {
  if (!email) return <div className="email-viewer email-viewer-empty">Select an email</div>

  return (
    <div className="email-viewer">
      <div className="email-viewer-header">
        <h2>{email.subject}</h2>
        {onClose && (
          <button type="button" onClick={onClose}>
            Close
          </button>
        )}
      </div>
      <div className="email-viewer-meta">
        <div>From: {email.sentFrom}</div>
        <div>To: {email.sentTo}</div>
        {email.cc && <div>Cc: {email.cc}</div>}
        <div>{new Date(email.sentAt).toLocaleString()}</div>
      </div>
      <iframe sandbox="" srcDoc={email.body} title={email.subject} />
    </div>
  )
}
