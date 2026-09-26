import { PageHeader } from '../shell/PageHeader'
import { PriceTrackerDashboard } from '../PriceTrackerDashboard'

export function PriceTracker() {
  return (
    <>
      <PageHeader
        title="Price Tracker"
        description="Track MacBook listings and get notified when prices drop."
      />
      <PriceTrackerDashboard />
    </>
  )
}
