import type { ReactNode } from 'react'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <p className="feedback loading" role="status">
      {label}
    </p>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="feedback empty" role="status">
      {children}
    </div>
  )
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="feedback error" role="alert">
      {message}
    </p>
  )
}

export function SuccessMessage({ message }: { message: string }) {
  return (
    <p className="feedback success" role="status">
      {message}
    </p>
  )
}
