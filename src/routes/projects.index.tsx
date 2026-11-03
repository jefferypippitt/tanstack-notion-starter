import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/page'
import { ProjectGrid } from '@/components/project-card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { fetchProjects } from '@/lib/server-functions'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { surfaceClasses } from '@/lib/surface-classes'

export const Route = createFileRoute('/projects/')({
  component: Projects,
  loader: async () => {
    const projects = await fetchProjects()
    // Featured work first, then everything else in date order.
    const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)]
    return { projects: ordered }
  },
  head: () => ({
    meta: [
      { title: `Projects - ${siteConfig.name}` },
      { name: 'description', content: `Projects by ${siteConfig.author.name}` },
    ],
  }),
})

function Projects() {
  const { projects } = Route.useLoaderData()

  return (
    <div className="page-stack">
      <PageHeader title="Projects" />

      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <Empty className={cn('rounded-xl border-0', surfaceClasses(2))}>
          <EmptyHeader>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Projects marked Published in your Notion database appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
