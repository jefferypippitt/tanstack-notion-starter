import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import type { Post } from '../lib/types'

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="block group no-underline"
    >
      <article className="island-shell rounded-xl overflow-hidden transition-transform hover:-translate-y-1 h-full flex flex-col">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <time className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {format(new Date(post.date), 'MMM d, yyyy')}
          </time>
          <h3 className="text-xl font-bold text-[var(--sea-ink)] mb-2 group-hover:text-[var(--lagoon-deep)] transition-colors">
            {post.title}
          </h3>
          <p className="text-[var(--sea-ink-soft)] mb-4 flex-1">{post.summary}</p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-[rgba(79,184,178,0.14)] text-[var(--lagoon-deep)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
