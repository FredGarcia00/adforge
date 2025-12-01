'use client'

import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  className,
}) => {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div ref={menuRef} className={cn('relative inline-block', className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors',
          selected.length > 0
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-1 min-w-[180px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {option.label}
              {selected.includes(option.value) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
          {selected.length > 0 && (
            <>
              <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-700" />
              <button
                onClick={clearAll}
                className="w-full px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export { FilterDropdown }
