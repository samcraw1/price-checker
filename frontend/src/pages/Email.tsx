import { PageHeader } from '../shell/PageHeader'
import { EmailDashboard } from '../EmailDashboard'


export function Email() {
  return (
    <>
      <PageHeader
        title="Email"
        description="Manage your emails — inbox, sent, drafts, and more."
      />
      <EmailDashboard />
    </>
  )
}
