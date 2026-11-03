import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { PageHeader, Section } from '@/components/page'
import { PostList } from '@/components/post-list'
import { ProjectGrid } from '@/components/project-card'
import { siteConfig } from '@/config/site'
import type { Post, Project } from '@/lib/types'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

// Pieces of the home page: a short intro, then recent writing and recent
// projects, each with a link to the full list beside its heading.

export function Intro() {
  return <PageHeader title={`Hey, I’m ${siteConfig.author.name}`} description={siteConfig.intro} />
}

function AllLink({ to, label }: { to: '/blog' | '/projects'; label: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex shrink-0 items-center gap-1 rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
        typeClass('body'),
      )}
    >
      {label}
      <ArrowRightIcon aria-hidden className="size-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

export function RecentPosts({ posts }: { posts: Post[] }) {
  return (
    <Section title="Recent posts" action={<AllLink to="/blog" label="All posts" />}>
      {posts.length > 0 ? (
        <PostList posts={posts} showSummary />
      ) : (
        <p className={cn(typeClass('body'), 'text-muted-foreground')}>No posts yet.</p>
      )}
    </Section>
  )
}

// The newest projects as cards, the same grid the Projects page uses.
export function RecentProjects({ projects }: { projects: Project[] }) {
  return (
    <Section title="Recent projects" action={<AllLink to="/projects" label="All projects" />}>
      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <p className={cn(typeClass('body'), 'text-muted-foreground')}>No projects yet.</p>
      )}
    </Section>
  )
}
