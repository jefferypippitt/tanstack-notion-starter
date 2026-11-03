import {
  getPosts as getNotionPosts,
  getProjects as getNotionProjects,
  isNotionConfigured,
} from './notion'
import { samplePosts, sampleProjects } from './sample-data'
import { siteConfig } from '../config/site'

// sitemap.xml, rss.xml, and robots.txt, built per request from the same posts
// and projects the pages show (served by the routes of the same names).

// The site's public address: siteConfig.url once it is set, otherwise the
// address the request came in on, so a fresh fork's feeds still link correctly.
export function siteUrl(request: Request) {
  const configured = siteConfig.url.replace(/\/$/, '')
  return configured && configured !== 'https://example.com' ? configured : new URL(request.url).origin
}

export async function generateSitemap(baseUrl: string) {
  const posts = isNotionConfigured() ? await getNotionPosts() : samplePosts
  const projects = isNotionConfigured() ? await getNotionProjects() : sampleProjects

  const pages: Array<{ url: string; priority: string; lastmod?: string }> = [
    { url: '/', priority: '1.0' },
    { url: '/blog', priority: '0.9' },
    { url: '/projects', priority: '0.9' },
    { url: '/about', priority: '0.8' },
    ...posts.map((post) => ({ url: `/blog/${post.slug}`, lastmod: post.date, priority: '0.7' })),
    ...projects.map((project) => ({ url: `/projects/${project.slug}`, lastmod: project.date, priority: '0.7' })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(baseUrl + page.url)}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`
}

export async function generateRSS(baseUrl: string) {
  const posts = isNotionConfigured() ? await getNotionPosts() : samplePosts

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${encodeURIComponent(post.slug)}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>${post.tags
        .map((tag) => `\n      <category>${escapeXml(tag)}</category>`)
        .join('')}
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`
}

export function generateRobots(baseUrl: string) {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`
}

// Feeds change when Notion does: browsers and CDNs may reuse one for an hour.
export function textResponse(body: string, contentType: string) {
  return new Response(body, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
