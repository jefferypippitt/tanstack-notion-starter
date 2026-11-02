import { createFileRoute, notFound } from '@tanstack/react-router'
import { format } from 'date-fns'
import { NotionRenderer } from '../components/NotionRenderer'
import { fetchProjectBySlug } from '../lib/server-functions'
import { siteConfig } from '../config/site'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectDetail,
  loader: async ({ params }) => {
    const project = await fetchProjectBySlug(params.slug)
    if (!project) {
      throw notFound()
    }
    return { project }
  },
  head: ({ loaderData }) => {
    const { project } = loaderData
    return {
      meta: [
        {
          title: `${project.title} - ${siteConfig.name}`,
        },
        {
          name: 'description',
          content: project.description,
        },
        {
          property: 'og:title',
          content: project.title,
        },
        {
          property: 'og:description',
          content: project.description,
        },
        ...(project.coverImage
          ? [
              {
                property: 'og:image',
                content: project.coverImage,
              },
            ]
          : []),
      ],
    }
  },
})

function ProjectDetail() {
  const { project } = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--lagoon-deep)] hover:underline mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </a>

          <div className="flex items-center gap-3 mb-3">
            <time className="text-sm text-gray-600 dark:text-gray-400">
              {format(new Date(project.date), 'MMMM yyyy')}
            </time>
            {project.featured && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--sea-ink)] mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-[var(--sea-ink-soft)]">{project.description}</p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-[rgba(79,184,178,0.14)] text-[var(--lagoon-deep)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 dark:bg-gray-800/50 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        </header>

        {project.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        )}

        {project.content && project.content.length > 0 && (
          <div className="prose-wrapper">
            <NotionRenderer blocks={project.content} />
          </div>
        )}
      </article>
    </main>
  )
}
