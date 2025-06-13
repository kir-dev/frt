import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  // Format: YYYY. MM. DD.
  return (
      date
          .toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
  )
}
