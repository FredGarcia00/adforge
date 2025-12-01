'use client'

import * as React from 'react'
import { X, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BulkActionBarProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete: () => void
  onExport: () => void
  isDeleting?: boolean
  isExporting?: boolean
  className?: string
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onDelete,
  onExport,
  isDeleting,
  isExporting,
  className,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        'flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-primary/5 px-6 py-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onClearSelection}
          className="rounded-full p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <X className="h-4 w-4 text-zinc-500" />
        </button>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {selectedCount} selected
        </span>
      </div>

      <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-600" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          disabled={isExporting}
          isLoading={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          isLoading={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
