'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { FilterDropdown } from '@/components/ui/filter-dropdown'
import { VideoStatus } from '@/types'

const STATUS_OPTIONS = [
  { label: 'Completed', value: 'completed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
]

interface ContentHeaderProps {
  title: string
  subtitle?: string
  totalCount: number
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter: VideoStatus[]
  onStatusFilterChange: (status: VideoStatus[]) => void
  createHref?: string
  createLabel?: string
}

export function ContentHeader({
  title,
  subtitle,
  totalCount,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  createHref = '/generate',
  createLabel = 'New Video',
}: ContentHeaderProps) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
            <span className="ml-2 text-sm font-normal text-zinc-500">({totalCount})</span>
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
        <Link href={createHref}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search videos..."
          className="w-full sm:w-64"
        />
        <FilterDropdown
          label="Status"
          options={STATUS_OPTIONS}
          selected={statusFilter}
          onChange={(values) => onStatusFilterChange(values as VideoStatus[])}
        />
      </div>
    </div>
  )
}
