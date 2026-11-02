import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { siteConfig } from '../config/site'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(23,58,64,0.08)] bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/70 dark:bg-[var(--sea-ink)]/80 dark:border-[rgba(255,255,255,0.08)]">
      <div className="page-wrap px-4 flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-lg font-bold text-[var(--sea-ink)]">{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/blog"
            className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors no-underline"
          >
            Blog
          </Link>
          <Link
            to="/projects"
            className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors no-underline"
          >
            Projects
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors no-underline"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
