'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.slice(0, 1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-full gap-1',
              pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}

        {/* Generate button in center */}
        <Link
          href="/generate"
          className="flex items-center justify-center w-12 h-12 -mt-4 rounded-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </Link>

        {navItems.slice(1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-full gap-1',
              pathname === item.href || pathname.startsWith(item.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
