import { PageHeader } from '../shell/PageHeader'
import { VideosDashboard } from '../VideosDashboard'

export function Videos() {
  return (
    <>
      <PageHeader
        title="Videos"
        description="Video ideas and content moving through Idea, Planning, Recording, Editing, Scheduled, and Published."
      />
      <VideosDashboard />
    </>
  )
}
