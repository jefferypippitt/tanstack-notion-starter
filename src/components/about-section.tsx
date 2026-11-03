import { NotionRenderer } from '@/components/notion-renderer'
import { Section } from '@/components/page'
import { formatYear } from '@/lib/format'
import type { AboutContent, Experience } from '@/lib/types'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

function period({ start, end }: Experience) {
  return `${formatYear(start)} – ${end ? formatYear(end) : 'Present'}`
}

// About and Experience in one place: the Type = About page's body from Notion,
// then the Type = Experience rows. Each is a top-level block of the page, so
// the page's stack spaces them.
export function AboutSection({ about }: { about: AboutContent }) {
  const { blocks, experience } = about

  return (
    <>
      {blocks.length > 0 && <NotionRenderer blocks={blocks} />}
      {experience.length > 0 && (
        <Section title="Experience" titleClassName="font-sans">
          {/* Rows on the same rhythm as the post list: 8px row padding,
              text on the column edge. */}
          <ul className="flex flex-col">
            {experience.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-6 py-2">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className={typeClass('subtitle')}>{item.role}</p>
                  {item.company && (
                    <p className={cn(typeClass('caption'), 'text-muted-foreground')}>{item.company}</p>
                  )}
                </div>
                <span className={cn('shrink-0 text-muted-foreground tabular-nums', typeClass('caption'))}>
                  {period(item)}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}

export function hasAbout(about: AboutContent) {
  return about.blocks.length > 0 || about.experience.length > 0
}
