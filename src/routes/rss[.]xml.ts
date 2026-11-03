import { createFileRoute } from '@tanstack/react-router'
import { generateRSS, siteUrl, textResponse } from '@/lib/seo-functions'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => textResponse(await generateRSS(siteUrl(request)), 'application/rss+xml'),
    },
  },
})
