import { PageHeader } from '../shell/PageHeader'
import { ProjectsDashboard } from '../ProjectsDashboard'

export function Projects() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="Software projects you've built or are building — title, tech, status, repo, and deployment links."
      />
      <ProjectsDashboard />
    </>
  )
}
