import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '../config/site'

export const Route = createFileRoute('/robots.txt')({
  component: () => null,
  loader: async () => {
    const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml`

    return new Response(robots, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  },
})
