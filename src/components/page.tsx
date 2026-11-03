import { useId } from 'react'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'

// The building blocks every route shares, so the spacing is set once:
// a page is a page-stack of blocks (40px apart), it opens with a PageHeader,
// and each Section puts its content 12px under its heading row.

// The page title (display, Noto Serif, 20px at the 550 heading weight, not bold) with an
// optional muted lede 4px below it. Children (an article's facts) follow 12px
// under the lede.
export function PageHeader({
  title,
  description,
  children,
  titleClassName,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  titleClassName?: string
}) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className={cn(typeClass('display'), 'font-serif weight-semibold', titleClassName)}>{title}</h1>
      {description && (
        <p className={cn(typeClass('subtitle'), 'text-muted-foreground')}>{description}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </header>
  )
}

// A titled block: the heading on the left, an optional action on the right of
// the same row, then the content. The heading is the title role (16px) in
// Noto Serif, muted, so it echoes the page title but stays a step below it.
export function Section({
  title,
  action,
  children,
  titleClassName,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  titleClassName?: string
}) {
  const id = useId()

  return (
    <section aria-labelledby={id} className="section-stack">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className={cn(typeClass('title'), 'font-serif text-muted-foreground', titleClassName)}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
