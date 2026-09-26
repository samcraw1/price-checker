import { EmptyModulePage } from './EmptyModulePage'

// TODO(backend): projects table (title, description, technologies, status,
// repository, deployment URL, notes) + CRUD routes.
export function Projects() {
  return (
    <EmptyModulePage
      title="Projects"
      description="Software projects you've built or are building — title, tech, status, repo, and deployment links."
      emptyMessage="No projects added yet."
      addLabel="+ Add project"
    />
  )
}
