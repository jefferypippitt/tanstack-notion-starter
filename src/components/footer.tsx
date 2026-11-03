import { GlobeIcon, MailIcon } from 'lucide-react'
import type { IconType } from 'react-icons'
import {
  FaBehance,
  FaBluesky,
  FaCodepen,
  FaDev,
  FaDiscord,
  FaDribbble,
  FaFigma,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaLinkedin,
  FaMastodon,
  FaMedium,
  FaStackOverflow,
  FaThreads,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/config/site'
import type { SocialLink } from '@/lib/types'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

// Brand icon by the link's host. Anything unknown gets a globe, so a new Link
// row in Notion always shows up even without a matching icon here.
const brandIcons: Array<[RegExp, IconType]> = [
  [/(^|\.)github\.com$/, FaGithub],
  [/(^|\.)gitlab\.com$/, FaGitlab],
  [/(^|\.)linkedin\.com$/, FaLinkedin],
  [/(^|\.)(x|twitter)\.com$/, FaXTwitter],
  [/(^|\.)bsky\.app$/, FaBluesky],
  [/(^|\.)threads\.(net|com)$/, FaThreads],
  [/(^|\.)instagram\.com$/, FaInstagram],
  [/(^|\.)(youtube\.com|youtu\.be)$/, FaYoutube],
  [/(^|\.)dribbble\.com$/, FaDribbble],
  [/(^|\.)behance\.net$/, FaBehance],
  [/(^|\.)figma\.com$/, FaFigma],
  [/(^|\.)codepen\.io$/, FaCodepen],
  [/(^|\.)dev\.to$/, FaDev],
  [/(^|\.)medium\.com$/, FaMedium],
  [/(^|\.)stackoverflow\.com$/, FaStackOverflow],
  [/(^|\.)(discord\.gg|discord\.com)$/, FaDiscord],
  [/(^|\.)(mastodon\.social|fosstodon\.org|hachyderm\.io)$/, FaMastodon],
]

function iconFor(url: string) {
  if (url.startsWith('mailto:')) return MailIcon
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return brandIcons.find(([pattern]) => pattern.test(host))?.[1] ?? GlobeIcon
  } catch {
    return GlobeIcon
  }
}

// Links come from Type = Link rows in Notion: icon only, labelled for screen
// readers by the row's Title, each opening in a new tab. The theme menu ends
// the row after a thin divider. The same 48px row (--bar-height) and 32px
// controls as the header, so the page is framed evenly top and bottom; the
// theme icon sits on the column edge.
export function SiteFooter({ links }: { links: SocialLink[] }) {
  return (
    <footer>
      <div className="page-column flex min-h-(--bar-height) flex-wrap items-center justify-between gap-x-4 py-2">
        <p className={cn(typeClass('caption'), 'text-muted-foreground')}>
          © {new Date().getFullYear()} {siteConfig.author.name}
        </p>
        {/* A 32px button around a 16px icon leaves 8px each side; pulling the
            row out by that much puts the last icon on the column edge. */}
        <div className="-mr-2 flex items-center gap-1">
          {links.length > 0 && (
            <>
              <ul className="flex flex-wrap items-center">
                {links.map((link) => {
                  const Icon = iconFor(link.url)
                  return (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label} (opens in a new tab)`}
                        title={link.label}
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <Icon aria-hidden className="size-4" />
                      </a>
                    </li>
                  )
                })}
              </ul>
              <span aria-hidden className="mx-1 h-4 w-px bg-border" />
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
