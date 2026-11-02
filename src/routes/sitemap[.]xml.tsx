import { createFileRoute } from '@tanstack/react-router'
import { fetchPosts, fetchProjects } from '../lib/server-functions'
import { siteConfig } from '../config/site'

export const Route = createFileRoute('/sitemap.xml')({
  component: () => null,
  loader: async () => {
    const [posts, projects] = await Promise.all([fetchPosts(), fetchProjects()])

    const baseUrl = siteConfig.url

    const staticPages = [
      { url: '/', priority: '1.0' },
      { url: '/blog', priority: '0.9' },
      { url: '/projects', priority: '0.9' },
      { url: '/about', priority: '0.8' },
    ]

    const postPages = posts.map((post) => ({
      url: `/blog/${post.slug}`,
      lastmod: post.date,
      priority: '0.7',
    }))

    const projectPages = projects.map((project) => ({
      url: `/projects/${project.slug}`,
      lastmod: project.date,
      priority: '0.7',
    }))

    const allPages = [...staticPages, ...postPages, ...projectPages]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  },
})
