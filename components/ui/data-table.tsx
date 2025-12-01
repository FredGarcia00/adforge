'use client'

import * as React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from './checkbox'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  column: string
  direction: SortDirection
}

export interface ColumnDef<T> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  width?: string
  hideOnMobile?: boolean
  className?: string
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: ColumnDef<T>[]
  selectedIds?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
  sortConfig?: SortConfig
  onSort?: (config: SortConfig) => void
  isLoading?: boolean
  emptyMessage?: string
}

function DataTable<T extends { id: string }>({
  data,
  columns,
  selectedIds = new Set(),
  onSelectionChange,
  sortConfig,
  onSort,
  isLoading,
  emptyMessage = 'No items found',
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(row.id))
  const someSelected = data.some((row) => selectedIds.has(row.id)) && !allSelected

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((row) => row.id)))
    }
  }

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange(newSelected)
  }

  const handleSort = (columnId: string) => {
    if (!onSort) return
    const newDirection: SortDirection =
      sortConfig?.column === columnId && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    onSort({ column: columnId, direction: newDirection })
  }

  const getCellValue = (row: T, column: ColumnDef<T>): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor] as React.ReactNode
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            {onSelectionChange && (
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400',
                  column.hideOnMobile && 'hidden md:table-cell',
                  column.width,
                  column.className
                )}
              >
                {column.sortable && onSort ? (
                  <button
                    onClick={() => handleSort(column.id)}
                    className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    {column.header}
                    <span className="flex flex-col">
                      <ChevronUp
                        className={cn(
                          'h-3 w-3 -mb-1',
                          sortConfig?.column === column.id && sortConfig?.direction === 'asc'
                            ? 'text-primary'
                            : 'text-zinc-300 dark:text-zinc-600'
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'h-3 w-3',
                          sortConfig?.column === column.id && sortConfig?.direction === 'desc'
                            ? 'text-primary'
                            : 'text-zinc-300 dark:text-zinc-600'
                        )}
                      />
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-zinc-100 dark:border-zinc-800 transition-colors',
                  'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
                  selectedIds.has(row.id) && 'bg-primary/5'
                )}
              >
                {onSelectionChange && (
                  <td className="w-12 px-4 py-3">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300',
                      column.hideOnMobile && 'hidden md:table-cell',
                      column.className
                    )}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export { DataTable }
