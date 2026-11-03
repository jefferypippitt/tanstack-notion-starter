import { format, isValid, parseISO } from 'date-fns'

// Notion dates arrive as "2024-01-15". parseISO reads them as local dates,
// so the server and the browser render the same day.
export function formatDate(date: string, pattern = 'MMM d, yyyy') {
  const parsed = parseISO(date)
  return isValid(parsed) ? format(parsed, pattern) : ''
}

export function formatYear(date: string) {
  return formatDate(date, 'yyyy')
}

export function formatList(items: string[]) {
  return items.join(', ')
}
