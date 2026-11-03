import { Link } from '@tanstack/react-router'
import { navigation } from '@/lib/navigation'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="page-column flex h-(--bar-height) items-center justify-between gap-4">
        <Link
          to="/"
          aria-label={`${siteConfig.author.name}, home`}
          className={cn(
            'rounded-md font-serif weight-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
            typeClass('subtitle'),
          )}
        >
          {initials(siteConfig.author.name)}
        </Link>
        <nav aria-label="Site" className="-mr-2.5">
          <ul className="flex items-center">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    'inline-flex h-8 items-center rounded-md px-2.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[status=active]:text-foreground data-[status=active]:weight-semibold',
                    typeClass('body'),
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
