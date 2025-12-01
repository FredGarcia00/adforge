'use client'

import * as React from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked, indeterminate, onChange, disabled, className }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'h-4 w-4 shrink-0 rounded border border-zinc-300 dark:border-zinc-600 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          (checked || indeterminate) && 'bg-primary border-primary',
          className
        )}
      >
        {indeterminate ? (
          <Minus className="h-3 w-3 text-white mx-auto" />
        ) : checked ? (
          <Check className="h-3 w-3 text-white mx-auto" />
        ) : null}
      </button>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
