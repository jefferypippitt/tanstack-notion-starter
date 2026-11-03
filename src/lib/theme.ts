export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

// Runs inline in <head> before the page paints, so a saved choice never flashes
// the wrong theme. It also follows live system changes while the choice is "system".
// Keep its logic in step with applyTheme below.
export const THEME_INIT_SCRIPT = `(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');var apply=function(){var t=null;try{t=localStorage.getItem('${STORAGE_KEY}')}catch(e){}var dark=t==='dark'||(t!=='light'&&m.matches);var r=document.documentElement;r.classList.toggle('dark',dark);r.style.colorScheme=dark?'dark':'light'};apply();m.addEventListener('change',apply)}catch(e){}})();`

export function getStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(theme: Theme) {
  try {
    if (theme === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be blocked; the theme still applies for this page view.
  }
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}
