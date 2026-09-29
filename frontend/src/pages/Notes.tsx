import { PageHeader } from '../shell/PageHeader'
import { NotesDashboard } from '../NotesDashboard'

export function Notes() {
  return (
    <>
      <PageHeader
        title="Notes"
        description="Personal notes and ideas. Simple for now — linking notes together can come later."
      />
      <NotesDashboard />
    </>
  )
}
