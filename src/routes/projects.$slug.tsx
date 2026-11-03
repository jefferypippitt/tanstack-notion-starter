import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArticleLayout, type ArticleFact } from '@/components/article-layout'
import { fetchProjectBySlug } from '@/lib/server-functions'
import { formatList, formatYear } from '@/lib/format'
import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectDetail,
  loader: async ({ params }) => {
    const project = await fetchProjectBySlug({ data: params.slug })
    if (!project) {
      throw notFound()
    }
    return { project }
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project
    if (!project) return {}
    return {
      meta: [
        { title: `${project.title} - ${siteConfig.name}` },
        { name: 'description', content: project.description },
        { property: 'og:title', content: project.title },
        { property: 'og:description', content: project.description },
        ...(project.coverImage
          ? [{ property: 'og:image', content: new URL(project.coverImage, siteConfig.url).href }]
          : []),
      ],
    }
  },
})

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-link">
      {children}
      <span aria-hidden> ↗</span>
    </a>
  )
}

function ProjectDetail() {
  const { project } = Route.useLoaderData()

  const facts: ArticleFact[] = [
    {
      label: 'Year',
      value: (
        <time dateTime={project.date} className="tabular-nums">
          {formatYear(project.date)}
        </time>
      ),
    },
  ]
  if (project.tags.length > 0) {
    facts.push({ label: 'Stack', value: formatList(project.tags) })
  }
  if (project.liveUrl || project.repoUrl) {
    facts.push({
      label: 'Links',
      value: (
        <span className="flex flex-col gap-1">
          {project.liveUrl && <ExternalLink href={project.liveUrl}>Live site</ExternalLink>}
          {project.repoUrl && <ExternalLink href={project.repoUrl}>Source code</ExternalLink>}
        </span>
      ),
    })
  }

  return (
    <ArticleLayout
      title={project.title}
      lede={project.description}
      facts={facts}
      coverImage={project.coverImage}
      coverVideo={project.coverVideo}
      content={project.content}
    />
  )
}
