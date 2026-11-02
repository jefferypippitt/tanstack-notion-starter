import { createFileRoute } from '@tanstack/react-router'
import { PostCard } from '../components/PostCard'
import { SetupBanner } from '../components/SetupBanner'
import { fetchPosts, checkNotionStatus } from '../lib/server-functions'
import { siteConfig } from '../config/site'
import { useState } from 'react'

export const Route = createFileRoute('/blog')({
  component: Blog,
  loader: async () => {
    const [posts, status] = await Promise.all([fetchPosts(), checkNotionStatus()])
    return { posts, status }
  },
  head: () => ({
    meta: [
      {
        title: `Blog - ${siteConfig.name}`,
      },
      {
        name: 'description',
        content: `Read articles and posts by ${siteConfig.author.name}`,
      },
    ],
  }),
})

function Blog() {
  const { posts, status } = Route.useLoaderData()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {status.usingFallback && <SetupBanner />}

      <section className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--sea-ink)] mb-4">Blog</h1>
        <p className="text-lg text-[var(--sea-ink-soft)] max-w-2xl">
          Thoughts, tutorials, and updates on web development, design, and technology.
        </p>
      </section>

      {allTags.length > 0 && (
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-[rgba(79,184,178,0.24)] text-[var(--lagoon-deep)] border-2 border-[var(--lagoon-deep)]'
                  : 'bg-gray-100 dark:bg-gray-800 text-[var(--sea-ink-soft)] hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All ({posts.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-[rgba(79,184,178,0.24)] text-[var(--lagoon-deep)] border-2 border-[var(--lagoon-deep)]'
                    : 'bg-gray-100 dark:bg-gray-800 text-[var(--sea-ink-soft)] hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tag} ({posts.filter((p) => p.tags.includes(tag)).length})
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        {filteredPosts.length === 0 ? (
          <div className="island-shell rounded-xl p-12 text-center">
            <p className="text-[var(--sea-ink-soft)]">No posts found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
