'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Zap,
  Plus,
  Home,
  Video,
  Calendar,
  FileText,
  Sparkles,
  LayoutTemplate,
  ImageIcon,
  BarChart3,
  TrendingUp,
  FolderKanban,
  Link2,
  CreditCard,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
  defaultExpanded?: boolean
}

const navSections: NavSection[] = [
  {
    title: '',
    defaultExpanded: true,
    items: [
      { href: '/dashboard', icon: Home, label: 'Dashboard' },
    ],
  },
  {
    title: 'Content',
    defaultExpanded: true,
    items: [
      { href: '/content/videos', icon: Video, label: 'Videos' },
      { href: '/scheduled', icon: Calendar, label: 'Scheduled' },
      { href: '/drafts', icon: FileText, label: 'Drafts' },
    ],
  },
  {
    title: 'Create',
    defaultExpanded: true,
    items: [
      { href: '/generate', icon: Sparkles, label: 'Generate Video' },
      { href: '/templates', icon: LayoutTemplate, label: 'Templates' },
      { href: '/assets', icon: ImageIcon, label: 'Assets' },
    ],
  },
  {
    title: 'Analytics',
    defaultExpanded: true,
    items: [
      { href: '/analytics', icon: BarChart3, label: 'Overview' },
      { href: '/analytics/performance', icon: TrendingUp, label: 'Performance' },
    ],
  },
  {
    title: 'Campaigns',
    defaultExpanded: false,
    items: [
      { href: '/campaigns', icon: FolderKanban, label: 'All Campaigns' },
    ],
  },
  {
    title: 'Settings',
    defaultExpanded: false,
    items: [
      { href: '/accounts', icon: Link2, label: 'TikTok Accounts' },
      { href: '/subscription', icon: CreditCard, label: 'Subscription' },
      { href: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

function NavSectionComponent({ section }: { section: NavSection }) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded ?? true)

  // Check if any item in section is active
  const hasActiveItem = section.items.some((item) =>
    pathname === item.href || pathname.startsWith(item.href + '/')
  )

  // No header for first section (Dashboard)
  if (!section.title) {
    return (
      <ul className="space-y-1">
        {section.items.map((item) => (
          <NavItemComponent key={item.href} item={item} isActive={pathname === item.href} />
        ))}
      </ul>
    )
  }

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        {section.title}
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform',
            !isExpanded && '-rotate-90'
          )}
        />
      </button>
      {isExpanded && (
        <ul className="space-y-1">
          {section.items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return <NavItemComponent key={item.href} item={item} isActive={isActive} />
          })}
        </ul>
      )}
    </div>
  )
}

function NavItemComponent({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors relative',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
        )}
        <item.icon className="h-4 w-4" />
        <span className="flex-1">{item.label}</span>
        {item.badge !== undefined && item.badge > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="h-6 w-6 text-[#FE2C55]" />
          <span>AdForge</span>
        </Link>
      </div>

      {/* Generate Button */}
      <div className="p-4">
        <Link href="/generate">
          <Button className="w-full bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Generate Video
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navSections.map((section, index) => (
          <NavSectionComponent key={section.title || index} section={section} />
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">D</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Demo User</p>
            <p className="text-xs text-primary truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
