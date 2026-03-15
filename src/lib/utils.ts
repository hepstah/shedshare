import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Escape LIKE/ILIKE wildcard characters in user input */
export function escapeLikePattern(input: string) {
  return input.replace(/[%_\\]/g, '\\$&')
}
