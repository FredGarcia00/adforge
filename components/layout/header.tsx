'use client'

import Link from 'next/link'
import { Zap, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  showLogo?: boolean
  className?: string
}

export function Header({ title, showLogo = true, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="flex items-center justify-between h-full px-4 max-w-lg mx-auto">
        {showLogo ? (
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-primary">
            <Zap className="h-5 w-5" />
            AdForge
          </Link>
        ) : (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}

        <button className="relative p-2 rounded-lg hover:bg-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  )
}
