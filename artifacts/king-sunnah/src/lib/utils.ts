import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * First letter for a plaque initial tile. Some narrator names in the source
 * corpus are narration fragments rather than clean names (e.g. "...Prophet
 * (S.A.W) said'"), so this skips leading punctuation/ellipses to find the
 * first real letter instead of showing "." or "…".
 */
export function initialOf(name: string): string {
  const match = name.trim().match(/[\p{L}\p{N}]/u)
  return match ? match[0].toUpperCase() : '؟'
}
