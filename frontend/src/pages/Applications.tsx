import { EmptyModulePage } from './EmptyModulePage'

// TODO(backend): applications table (company, role, status, dates, notes) + CRUD routes.
export function Applications() {
  return (
    <EmptyModulePage
      title="Applications"
      description="Track job applications — company, role, status, dates, and notes."
      emptyMessage="No applications added yet."
      addLabel="+ Add application"
    />
  )
}
