import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Import types
type Post = {
  slug: string
  date: string
}

type Project = {
  slug: string
  date: string
}

// Site config
const siteConfig = {
  url: 'https://your-site.com',
  title: 'Portfolio & Blog',
  description: 'Developer, designer, and creator of things.',
}

// Sample data (will use actual Notion data in production)
const samplePosts: Post[] = [
  { slug: 'getting-started-with-tanstack-start', date: '2024-01-15' },
  { slug: 'building-with-typescript', date: '2024-01-10' },
  { slug: 'modern-css-with-tailwind', date: '2024-01-05' },
]

const sampleProjects: Project[] = [
  { slug: 'notion-cms-starter', date: '2024-01-20' },
  { slug: 'task-manager-app', date: '2024-01-15' },
  { slug: 'weather-dashboard', date: '2024-01-10' },
]

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateSitemap(): string {
  const baseUrl = siteConfig.url

  const staticPages = [
    { url: '/', priority: '1.0' },
    { url: '/blog', priority: '0.9' },
    { url: '/projects', priority: '0.9' },
    { url: '/about', priority: '0.8' },
  ]

  const postPages = samplePosts.map((post) => ({
    url: `/blog/${post.slug}`,
    lastmod: post.date,
    priority: '0.7',
  }))

  const projectPages = sampleProjects.map((project) => ({
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
}

function generateRSS(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${samplePosts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.slug.replace(/-/g, ' '))}</title>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
      <description>Blog post</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`
}

function generateRobots(): string {
  return `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml`
}

// Generate files
const publicDir = join(process.cwd(), 'dist', 'client')
mkdirSync(publicDir, { recursive: true })

writeFileSync(join(publicDir, 'sitemap.xml'), generateSitemap())
writeFileSync(join(publicDir, 'rss.xml'), generateRSS())
writeFileSync(join(publicDir, 'robots.txt'), generateRobots())

console.log('✓ Generated SEO files: sitemap.xml, rss.xml, robots.txt')
