import { createFileRoute } from '@tanstack/react-router'
import { generateRobots, siteUrl, textResponse } from '@/lib/seo-functions'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: ({ request }) => textResponse(generateRobots(siteUrl(request)), 'text/plain'),
    },
  },
})
