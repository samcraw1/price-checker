import { EmptyModulePage } from './EmptyModulePage'

// TODO(backend): videos table (title, status, notes) + CRUD routes.
// Status pipeline: Idea -> Planning -> Recording -> Editing -> Scheduled -> Published.
export function Videos() {
  return (
    <EmptyModulePage
      title="Videos"
      description="Video ideas and content moving through Idea, Planning, Recording, Editing, Scheduled, and Published."
      emptyMessage="No videos planned yet."
      addLabel="+ Add video"
    />
  )
}
