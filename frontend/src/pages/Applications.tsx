import { PageHeader } from '../shell/PageHeader'
import { ApplicationsDashboard } from '../ApplicationsDashboard'

export function Applications() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Track job applications — company, role, status, dates, and notes."
      />
      <ApplicationsDashboard />
    </>
  )
}
