import { createFileRoute } from '@tanstack/react-router'
import { ProjectCard } from '../components/ProjectCard'
import { SetupBanner } from '../components/SetupBanner'
import { fetchProjects, checkNotionStatus } from '../lib/server-functions'
import { siteConfig } from '../config/site'

export const Route = createFileRoute('/projects')({
  component: Projects,
  loader: async () => {
    const [projects, status] = await Promise.all([fetchProjects(), checkNotionStatus()])
    return { projects, status }
  },
  head: () => ({
    meta: [
      {
        title: `Projects - ${siteConfig.name}`,
      },
      {
        name: 'description',
        content: `Projects and work by ${siteConfig.author.name}`,
      },
    ],
  }),
})

function Projects() {
  const { projects, status } = Route.useLoaderData()

  const featured = projects.filter((p) => p.featured)
  const other = projects.filter((p) => !p.featured)

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {status.usingFallback && <SetupBanner />}

      <section className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--sea-ink)] mb-4">Projects</h1>
        <p className="text-lg text-[var(--sea-ink-soft)] max-w-2xl">
          A collection of projects I've built, from side projects to production applications.
        </p>
      </section>

      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">Featured</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {other.length > 0 && (
        <section>
          {featured.length > 0 && (
            <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">More Projects</h2>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {other.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className="island-shell rounded-xl p-12 text-center">
          <p className="text-[var(--sea-ink-soft)]">No projects found.</p>
        </div>
      )}
    </main>
  )
}
