import { useEffect, useState } from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { applyTheme, getStoredTheme, type Theme } from '@/lib/theme'
import { surfaceClasses } from '@/lib/surface-classes'
import { useSurface } from '@/lib/surface-context'
import { cn } from '@/lib/utils'

const options = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: MonitorIcon },
] as const

// An icon button that opens a Light / Dark / System menu. The button's icon
// follows the theme actually showing (the .dark class), so it is right on the
// first paint, before the saved choice has been read.
export function ThemeToggle() {
  // The server can't know the saved choice, so read it after hydration.
  const [theme, setTheme] = useState<Theme>('system')
  // A menu sits two steps above whatever it opens from, with a constant
  // level-3 shadow so it reads as a menu at any depth.
  const menuLevel = Math.min(useSurface() + 2, 8)

  useEffect(() => {
    setTheme(getStoredTheme())
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Change color theme"
            // Muted like the footer's link icons beside it.
            className="text-muted-foreground hover:text-foreground"
          />
        }
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // It lives in the footer, so the menu opens upward.
        side="top"
        align="end"
        className={cn('w-36 ring-0', surfaceClasses(menuLevel, 3))}
      >
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            const next = value as Theme
            setTheme(next)
            applyTheme(next)
          }}
        >
          {options.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
