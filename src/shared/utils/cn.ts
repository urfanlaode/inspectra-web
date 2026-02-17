import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS class names with clsx and twMerge.
 * @param inputs
 * @returns
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
