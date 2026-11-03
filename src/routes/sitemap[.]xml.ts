import { createFileRoute } from '@tanstack/react-router'
import { generateSitemap, siteUrl, textResponse } from '@/lib/seo-functions'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => textResponse(await generateSitemap(siteUrl(request)), 'application/xml'),
    },
  },
})
