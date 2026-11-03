import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TooltipProvider } from '#/components/ui/tooltip'
import { SiteHeader } from '@/components/header'
import { SiteFooter } from '@/components/footer'
import { SetupBanner } from '@/components/setup-banner'
import { PageHeader } from '@/components/page'
import { checkNotionStatus, fetchLinks } from '@/lib/server-functions'
import { THEME_INIT_SCRIPT } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  loader: async () => {
    const [links, status] = await Promise.all([fetchLinks(), checkNotionStatus()])
    return { links, status }
  },
  // Neither changes while someone browses, so moving between pages skips the refetch.
  staleTime: Infinity,
  component: RootLayout,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'RSS Feed',
        href: '/rss.xml',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only rounded-md bg-foreground px-3 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
        <TanStackDevtools
          config={{
            // Left, so in dev it never covers the footer's theme toggle.
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

// Every page: sticky header, one narrow 40rem column, footer pinned to the bottom
// of the screen when the page is short. Header, main and footer share the
// column and its gutter; main holds the same padding above and below every
// route (--page-y), and the routes space themselves with page-stack.
function RootLayout() {
  const { links, status } = Route.useLoaderData()

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-column flex-1 py-(--page-y)">
        {status.problem && <SetupBanner problem={status.problem} />}
        <Outlet />
      </main>
      <SiteFooter links={links} />
    </>
  )
}

function NotFound() {
  return (
    <div className="page-stack">
      <PageHeader title="Page not found" description="It may have moved, or the link is broken." />
      <p>
        <Link to="/" className={cn(typeClass('body'), 'text-link')}>
          Go to the homepage
        </Link>
      </p>
    </div>
  )
}
