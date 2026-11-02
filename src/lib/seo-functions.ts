import { createServerFn } from '@tanstack/react-start'
import {
  getPosts as getNotionPosts,
  getProjects as getNotionProjects,
  isNotionConfigured,
} from './notion'
import { samplePosts, sampleProjects } from './sample-data'
import { siteConfig } from '../config/site'

export const generateSitemap = createServerFn({
  method: 'GET',
}).handler(async () => {
  const posts = isNotionConfigured() ? await getNotionPosts() : samplePosts
  const projects = isNotionConfigured() ? await getNotionProjects() : sampleProjects

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

  return `<?xml version="1.0" encoding="UTF-8"?>
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
})

export const generateRSS = createServerFn({
  method: 'GET',
}).handler(async () => {
  const posts = isNotionConfigured() ? await getNotionPosts() : samplePosts

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`

  return rss
})

export const generateRobots = createServerFn({
  method: 'GET',
}).handler(async () => {
  return `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml`
})

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
