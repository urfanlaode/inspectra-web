import { format } from 'date-fns'

export function humanDatestring(datestring?: string | Date): string | undefined {
  if (!datestring) return datestring
  const date = new Date(datestring)
  return format(date, 'dd MMM yyyy')
}
