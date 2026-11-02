import { createFileRoute, notFound } from '@tanstack/react-router'
import { format } from 'date-fns'
import { NotionRenderer } from '../components/NotionRenderer'
import { fetchPostBySlug } from '../lib/server-functions'
import { siteConfig } from '../config/site'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPost,
  loader: async ({ params }) => {
    const post = await fetchPostBySlug(params.slug)
    if (!post) {
      throw notFound()
    }
    return { post }
  },
  head: ({ loaderData }) => {
    const { post } = loaderData
    return {
      meta: [
        {
          title: `${post.title} - ${siteConfig.name}`,
        },
        {
          name: 'description',
          content: post.summary,
        },
        {
          property: 'og:title',
          content: post.title,
        },
        {
          property: 'og:description',
          content: post.summary,
        },
        ...(post.coverImage
          ? [
              {
                property: 'og:image',
                content: post.coverImage,
              },
            ]
          : []),
        {
          property: 'article:published_time',
          content: post.date,
        },
      ],
    }
  },
})

function BlogPost() {
  const { post } = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--lagoon-deep)] hover:underline mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </a>

          <time className="block text-sm text-gray-600 dark:text-gray-400 mb-3">
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </time>

          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--sea-ink)] mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-[var(--sea-ink-soft)]">{post.summary}</p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-[rgba(79,184,178,0.14)] text-[var(--lagoon-deep)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        )}

        {post.content && post.content.length > 0 && (
          <div className="prose-wrapper">
            <NotionRenderer blocks={post.content} />
          </div>
        )}
      </article>
    </main>
  )
}
