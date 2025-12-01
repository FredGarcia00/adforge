'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, placeholder = 'Search...', onClear, className }, ref) => {
    const handleClear = () => {
      onChange('')
      onClear?.()
    }

    return (
      <div className={cn('relative', className)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-sm',
            'placeholder:text-zinc-400',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
          )}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
