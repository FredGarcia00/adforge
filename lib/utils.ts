import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return formatDate(date)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Status badge color utilities
export function getStatusColor(status: 'pending' | 'processing' | 'completed' | 'failed'): string {
  const colors = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    pending: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status]
}

export function getStatusVariant(status: 'pending' | 'processing' | 'completed' | 'failed'): 'default' | 'success' | 'warning' | 'error' {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    completed: 'success',
    processing: 'warning',
    pending: 'default',
    failed: 'error',
  }
  return variants[status]
}

export function getStatusLabel(status: 'pending' | 'processing' | 'completed' | 'failed'): string {
  const labels = {
    completed: 'Completed',
    processing: 'Processing',
    pending: 'Pending',
    failed: 'Failed',
  }
  return labels[status]
}
