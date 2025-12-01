'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children, align = 'end', className }) => {
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

  return (
    <div ref={menuRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[160px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  children: React.ReactNode
  className?: string
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  onClick,
  disabled,
  destructive,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center px-3 py-2 text-sm transition-colors',
        'hover:bg-zinc-100 dark:hover:bg-zinc-700',
        'disabled:cursor-not-allowed disabled:opacity-50',
        destructive && 'text-red-600 dark:text-red-400',
        !destructive && 'text-zinc-700 dark:text-zinc-300',
        className
      )}
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator: React.FC = () => {
  return <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-700" />
}

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator }
