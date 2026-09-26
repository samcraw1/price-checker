import { PageHeader } from '../shell/PageHeader'
import { EmptyState } from '../components/Feedback'

type EmptyModulePageProps = {
  title: string
  description: string
  emptyMessage: string
  addLabel: string
}

// TODO(backend): each module using this shell needs its own table + CRUD
// routes before the "+ Add" button below can do anything real.
export function EmptyModulePage({ title, description, emptyMessage, addLabel }: EmptyModulePageProps) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <span className="disabled-action">
            <button type="button" disabled>
              {addLabel}
            </button>
            <span className="field-todo">⚠ Not built yet</span>
          </span>
        }
      />
      <EmptyState>{emptyMessage}</EmptyState>
    </>
  )
}
