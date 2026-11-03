import { createFileRoute } from '@tanstack/react-router'
import { MEDIA_KINDS, resolveMediaUrl, type MediaKind } from '@/lib/notion'

// A stable address for a file uploaded to Notion (a cover image or cover
// video). Notion's own links expire after about an hour, so pages link here and
// this looks up a fresh one and redirects. The redirect may be cached for 30
// minutes, well inside the link's lifetime. Video seeking still works: the
// browser follows the redirect and makes its range requests to Notion's storage.
export const Route = createFileRoute('/media/$pageId/$kind')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const kind = params.kind as MediaKind
        if (!(kind in MEDIA_KINDS)) return new Response('Not found', { status: 404 })

        const url = await resolveMediaUrl(params.pageId, kind)
        if (!url) return new Response('Not found', { status: 404 })

        return new Response(null, {
          status: 302,
          headers: {
            Location: url,
            'Cache-Control': 'public, max-age=1800',
          },
        })
      },
    },
  },
})
