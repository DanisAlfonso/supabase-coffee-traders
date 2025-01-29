import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusVariant(status: string): "default" | "success" | "warning" | "destructive" {
  switch (status.toLowerCase()) {
    case 'processing':
      return 'default'
    case 'shipped':
      return 'success'
    case 'pending':
      return 'warning'
    case 'cancelled':
      return 'destructive'
    default:
      return 'default'
  }
} 