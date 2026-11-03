import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from '@/components/page'
import { PostList } from '@/components/post-list'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { fetchPosts } from '@/lib/server-functions'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'
import { surfaceClasses } from '@/lib/surface-classes'

const ALL = 'all'

// A filter bar, so the compact step: 28px items (size="sm") with the compact
// body role (12/18). Muted; the selected tag turns foreground and semibold.
const tagClass = cn(
  typeClass('body', 'compact'),
  'text-muted-foreground weight-normal aria-pressed:text-foreground aria-pressed:weight-semibold',
)

export const Route = createFileRoute('/blog/')({
  component: Blog,
  loader: async () => {
    const posts = await fetchPosts()
    return { posts }
  },
  head: () => ({
    meta: [
      { title: `Writing - ${siteConfig.name}` },
      { name: 'description', content: `Writing by ${siteConfig.author.name}` },
    ],
  }),
})

function Blog() {
  const { posts } = Route.useLoaderData()
  const [selectedTag, setSelectedTag] = useState(ALL)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
  const filteredPosts =
    selectedTag === ALL ? posts : posts.filter((p) => p.tags.includes(selectedTag))

  return (
    <div className="page-stack">
      <PageHeader title="Writing" />

      {/* The filter sits a heading's distance above the list it filters. */}
      <div className="section-stack">
        {allTags.length > 1 && (
          <ToggleGroup
            aria-label="Filter posts by topic"
            variant="outline"
            size="sm"
            className="flex-wrap"
            value={[selectedTag]}
            onValueChange={(value) => setSelectedTag(value[0] ?? ALL)}
          >
            <ToggleGroupItem value={ALL} className={tagClass}>
              All
            </ToggleGroupItem>
            {allTags.map((tag) => (
              <ToggleGroupItem key={tag} value={tag} className={tagClass}>
                {tag}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        {filteredPosts.length > 0 ? (
          <PostList posts={filteredPosts} showSummary datePattern="MMM d, yyyy" />
        ) : (
          <Empty className={cn('rounded-xl border-0', surfaceClasses(2))}>
            <EmptyHeader>
              <EmptyTitle>No posts yet</EmptyTitle>
              <EmptyDescription>
                Posts marked Published in your Notion database appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  )
}
