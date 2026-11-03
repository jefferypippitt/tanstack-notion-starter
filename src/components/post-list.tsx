import { Link } from '@tanstack/react-router'
import { formatDate } from '@/lib/format'
import type { Post } from '@/lib/types'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

// Compact rows: title on the left, date on the right. A row lifts onto a card
// neutral hover overlay, since the whole row is the link.
export function PostList({
  posts,
  showSummary = false,
  datePattern = 'MMM yyyy',
}: {
  posts: Post[]
  showSummary?: boolean
  datePattern?: string
}) {
  return (
    // Rows on the size ladder: 8px row padding and item padding (itemPx), pulled
    // out by the same 8px so the text sits on the column edge.
    <ul className="-mx-2 flex flex-col">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="group flex items-baseline justify-between gap-6 rounded-lg px-2 py-2 outline-none transition-colors hover:bg-hover focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className={typeClass('subtitle')}>{post.title}</span>
              {showSummary && post.summary && (
                <span className={cn(typeClass('caption'), 'line-clamp-1 text-muted-foreground')}>{post.summary}</span>
              )}
            </span>
            <time dateTime={post.date} className={cn('shrink-0 text-muted-foreground tabular-nums', typeClass('caption'))}>
              {formatDate(post.date, datePattern)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  )
}
