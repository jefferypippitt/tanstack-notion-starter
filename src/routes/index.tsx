import { createFileRoute } from '@tanstack/react-router'
import { PostCard } from '../components/PostCard'
import { ProjectCard } from '../components/ProjectCard'
import { SetupBanner } from '../components/SetupBanner'
import { fetchPosts, fetchProjects, checkNotionStatus } from '../lib/server-functions'
import { siteConfig } from '../config/site'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const [posts, projects, status] = await Promise.all([
      fetchPosts(),
      fetchProjects(),
      checkNotionStatus(),
    ])

    const recentPosts = posts.slice(0, 3)
    const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)

    return { posts: recentPosts, projects: featuredProjects, status }
  },
  head: () => ({
    meta: [
      {
        title: `${siteConfig.name} - ${siteConfig.title}`,
      },
      {
        name: 'description',
        content: siteConfig.description,
      },
      {
        property: 'og:title',
        content: `${siteConfig.name} - ${siteConfig.title}`,
      },
      {
        property: 'og:description',
        content: siteConfig.description,
      },
    ],
  }),
})

function Home() {
  const { posts, projects, status } = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {status.usingFallback && <SetupBanner />}

      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 mb-16">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />

        <div className="relative z-10">
          <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
            {siteConfig.author.bio}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/projects"
              className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
            >
              View Projects
            </a>
            <a
              href="/blog"
              className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 dark:bg-gray-800/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
            >
              Read Blog
            </a>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--sea-ink)]">Featured Projects</h2>
            <a
              href="/projects"
              className="text-sm font-medium text-[var(--lagoon-deep)] hover:underline"
            >
              View all →
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--sea-ink)]">Recent Posts</h2>
            <a href="/blog" className="text-sm font-medium text-[var(--lagoon-deep)] hover:underline">
              View all →
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
