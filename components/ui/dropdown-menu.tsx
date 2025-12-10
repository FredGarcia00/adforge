'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children, align = 'end', className }) => {
  const [open, setOpen] = React.useState(false)
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Calculate menu position when opening
  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const menuWidth = 160 // min-w-[160px]

      setMenuPosition({
        top: rect.bottom + 4,
        left: align === 'end' ? rect.right - menuWidth : rect.left,
      })
    }
  }, [open, align])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
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

  // Close on scroll
  React.useEffect(() => {
    if (open) {
      const handleScroll = () => setOpen(false)
      window.addEventListener('scroll', handleScroll, true)
      return () => window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  return (
    <div ref={triggerRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{ top: menuPosition.top, left: menuPosition.left }}
          className="fixed z-50 min-w-[160px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>,
        document.body
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
