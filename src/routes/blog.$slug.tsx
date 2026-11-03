import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArticleLayout, type ArticleFact } from '@/components/article-layout'
import { fetchPostBySlug } from '@/lib/server-functions'
import { formatDate, formatList } from '@/lib/format'
import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPost,
  loader: async ({ params }) => {
    const post = await fetchPostBySlug({ data: params.slug })
    if (!post) {
      throw notFound()
    }
    return { post }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) return {}
    return {
      meta: [
        { title: `${post.title} - ${siteConfig.name}` },
        { name: 'description', content: post.summary },
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.summary },
        ...(post.coverImage
          ? [{ property: 'og:image', content: new URL(post.coverImage, siteConfig.url).href }]
          : []),
        { property: 'article:published_time', content: post.date },
      ],
    }
  },
})

function BlogPost() {
  const { post } = Route.useLoaderData()

  const facts: ArticleFact[] = [
    {
      label: 'Published',
      value: (
        <time dateTime={post.date} className="tabular-nums">
          {formatDate(post.date, 'MMMM d, yyyy')}
        </time>
      ),
    },
  ]
  if (post.tags.length > 0) {
    facts.push({ label: 'Topics', value: formatList(post.tags) })
  }

  return (
    <ArticleLayout
      title={post.title}
      lede={post.summary}
      facts={facts}
      coverImage={post.coverImage}
      content={post.content}
    />
  )
}
