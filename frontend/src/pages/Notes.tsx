import { EmptyModulePage } from './EmptyModulePage'

// TODO(backend): notes table (title, body, timestamps) + CRUD routes.
// TODO(future): linked notes / "second brain" graph — not built yet, keep the
// data model simple until this page has real content to link between.
export function Notes() {
  return (
    <EmptyModulePage
      title="Notes"
      description="Personal notes and ideas. Simple for now — linking notes together can come later."
      emptyMessage="No notes created yet."
      addLabel="+ Add note"
    />
  )
}
