import { NotionRenderer } from '@/components/notion-renderer'
import { PageHeader } from '@/components/page'
import type { NotionBlock } from '@/lib/types'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'
import { Elevated } from '@/lib/elevated'
import { CoverMedia } from '@/components/cover-media'

export type ArticleFact = { label: string; value: React.ReactNode }

// Shared layout for a post or project page: the header (title, lede, facts),
// the cover, and the body, spaced by the page stack like every other route.
export function ArticleLayout({
  title,
  lede,
  facts,
  coverImage,
  coverVideo,
  content,
}: {
  title: string
  lede?: string
  facts: ArticleFact[]
  coverImage?: string
  coverVideo?: string
  content?: NotionBlock[]
}) {
  return (
    <article className="page-stack">
      <PageHeader title={title} description={lede}>
        {facts.length > 0 && (
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-0.5">
                <dt className={cn(typeClass('caption'), 'text-muted-foreground')}>{fact.label}</dt>
                <dd className={typeClass('body')}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </PageHeader>

      {(coverImage || coverVideo) && (
        <Elevated offset={1} className="rounded-xl p-1">
          <CoverMedia
            image={coverImage}
            video={coverVideo}
            eager
            // Concentric with the frame: 14px corner - 4px inset = 10px.
            // 2:1 from sm up keeps the cover to ~300px across the column;
            // phones keep 16:9.
            className="aspect-video w-full rounded-[10px] object-cover object-top sm:aspect-[2/1]"
          />
        </Elevated>
      )}

      {content && content.length > 0 && <NotionRenderer blocks={content} />}
    </article>
  )
}
