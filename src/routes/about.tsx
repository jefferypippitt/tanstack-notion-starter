import { createFileRoute } from '@tanstack/react-router'
import { AboutSection, hasAbout } from '@/components/about-section'
import { PageHeader } from '@/components/page'
import { fetchAbout } from '@/lib/server-functions'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

export const Route = createFileRoute('/about')({
  component: About,
  loader: () => fetchAbout(),
  head: () => ({
    meta: [
      { title: `About - ${siteConfig.name}` },
      { name: 'description', content: siteConfig.author.bio },
    ],
  }),
})

// The Type = About page from Notion, then the Type = Experience rows.
function About() {
  const about = Route.useLoaderData()

  return (
    <div className="page-stack">
      <PageHeader title="About" />
      {hasAbout(about) ? (
        <AboutSection about={about} />
      ) : (
        <p className={cn(typeClass('body'), 'text-muted-foreground')}>Nothing here yet.</p>
      )}
    </div>
  )
}
