import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'
import { typeClass } from '@/lib/type-scale'
import { Elevated } from '@/lib/elevated'
import { CoverMedia } from '@/components/cover-media'

// The Projects page and the home page: an even grid, two across from sm up, one on phones. Two
// is all a 640px column holds while the covers still read.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}

// A framed card one step above the page: a 16:9 cover on top, then the title
// and a one-line description. Hover lifts the shadow one step.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Elevated
        offset={1}
        className="flex h-full flex-col rounded-xl p-1 transition-shadow duration-200 group-hover:shadow-surface-3"
      >
        {/* Concentric with the frame: 14px corner - 4px inset = 10px. */}
        <div className="relative aspect-video overflow-hidden rounded-[10px] bg-muted">
          <CoverMedia
            image={project.coverImage}
            video={project.coverVideo}
            className="absolute inset-0 size-full object-cover object-top"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-0.5 px-1.5 pt-2 pb-1">
          <p className={cn(typeClass('subtitle'), 'truncate weight-semibold')}>{project.title}</p>
          {project.description && (
            <p className={cn(typeClass('caption'), 'line-clamp-1 text-muted-foreground')}>
              {project.description}
            </p>
          )}
        </div>
      </Elevated>
    </Link>
  )
}
