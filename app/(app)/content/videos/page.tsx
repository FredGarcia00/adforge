'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, MoreHorizontal, Eye, Download, Trash2 } from 'lucide-react'
import { Video, VideoStatus } from '@/types'
import { ContentHeader } from '@/components/content/content-header'
import { BulkActionBar } from '@/components/content/bulk-action-bar'
import { DataTable, ColumnDef } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useVideoSelection } from '@/hooks/use-video-selection'
import { useVideoFilters } from '@/hooks/use-video-filters'
import { formatNumber, formatRelativeTime, getStatusVariant, getStatusLabel } from '@/lib/utils'

// Mock data for when Supabase isn't configured
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    user_id: 'demo',
    title: 'Summer Sale Promo',
    prompt: 'Create a viral TikTok video promoting summer sale',
    video_url: null,
    thumbnail_url: null,
    status: 'completed',
    views: 12500,
    likes: 890,
    shares: 234,
    saves: 156,
    product_name: 'Summer Collection',
    product_price: '$29.99',
    product_link: null,
    product_benefits: ['Lightweight', 'Breathable'],
    brand_colors: ['#FE2C55'],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user_id: 'demo',
    title: 'New Product Launch',
    prompt: 'Showcase our new skincare product',
    video_url: null,
    thumbnail_url: null,
    status: 'processing',
    views: 0,
    likes: 0,
    shares: 0,
    saves: 0,
    product_name: 'Glow Serum',
    product_price: '$49.99',
    product_link: null,
    product_benefits: ['Hydrating', 'Anti-aging'],
    brand_colors: ['#FF6B6B'],
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    user_id: 'demo',
    title: 'Behind the Scenes',
    prompt: 'Show behind the scenes of our warehouse',
    video_url: null,
    thumbnail_url: null,
    status: 'completed',
    views: 8200,
    likes: 456,
    shares: 89,
    saves: 67,
    product_name: null,
    product_price: null,
    product_link: null,
    product_benefits: null,
    brand_colors: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    user_id: 'demo',
    title: 'Customer Testimonial',
    prompt: 'Create a UGC-style testimonial video',
    video_url: null,
    thumbnail_url: null,
    status: 'pending',
    views: 0,
    likes: 0,
    shares: 0,
    saves: 0,
    product_name: 'Wellness Bundle',
    product_price: '$79.99',
    product_link: null,
    product_benefits: ['Natural', 'Organic'],
    brand_colors: ['#4CAF50'],
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    user_id: 'demo',
    title: 'Flash Sale Alert',
    prompt: 'Urgent flash sale announcement video',
    video_url: null,
    thumbnail_url: null,
    status: 'failed',
    views: 0,
    likes: 0,
    shares: 0,
    saves: 0,
    product_name: 'All Products',
    product_price: '50% OFF',
    product_link: null,
    product_benefits: null,
    brand_colors: ['#FF5722'],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url !== 'your_supabase_project_url')
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    filteredVideos,
  } = useVideoFilters(videos)

  const {
    selectedIds,
    setSelectedIds,
    clearSelection,
    selectedCount,
  } = useVideoSelection(filteredVideos)

  // Fetch videos
  useEffect(() => {
    async function fetchVideos() {
      if (!isSupabaseConfigured()) {
        // Use mock data when Supabase isn't configured
        setVideos(MOCK_VIDEOS)
        setUsingMockData(true)
        setIsLoading(false)
        return
      }

      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setVideos(data || [])
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        setVideos(MOCK_VIDEOS)
        setUsingMockData(true)
      }
      setIsLoading(false)
    }
    fetchVideos()
  }, [])

  // Handle single video delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    if (usingMockData) {
      setVideos((prev) => prev.filter((v) => v.id !== id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      return
    }

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error } = await supabase.from('videos').delete().eq('id', id)

    if (!error) {
      setVideos((prev) => prev.filter((v) => v.id !== id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCount} videos?`)) return

    setIsDeleting(true)

    if (usingMockData) {
      setVideos((prev) => prev.filter((v) => !selectedIds.has(v.id)))
      clearSelection()
      setIsDeleting(false)
      return
    }

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const ids = Array.from(selectedIds)

    const { error } = await supabase.from('videos').delete().in('id', ids)

    if (!error) {
      setVideos((prev) => prev.filter((v) => !selectedIds.has(v.id)))
      clearSelection()
    }
    setIsDeleting(false)
  }

  // Handle bulk export (placeholder)
  const handleBulkExport = async () => {
    alert('Export functionality coming soon!')
  }

  // Define table columns
  const columns: ColumnDef<Video>[] = [
    {
      id: 'video',
      header: 'Video',
      sortable: true,
      width: 'min-w-[280px]',
      accessor: (video) => (
        <div className="flex items-center gap-3">
          <Link href={`/video/${video.id}`} className="relative shrink-0">
            <div className="relative h-[45px] w-[80px] overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.title || 'Video thumbnail'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Play className="h-4 w-4 text-zinc-400" />
                </div>
              )}
            </div>
          </Link>
          <div className="min-w-0">
            <Link
              href={`/video/${video.id}`}
              className="block truncate font-medium text-zinc-900 dark:text-zinc-100 hover:text-primary"
            >
              {video.title || 'Untitled Video'}
            </Link>
            <p className="truncate text-xs text-zinc-500">
              {video.product_name || 'No product'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (video) => (
        <Badge variant={getStatusVariant(video.status)}>
          {getStatusLabel(video.status)}
        </Badge>
      ),
    },
    {
      id: 'views',
      header: 'Views',
      sortable: true,
      hideOnMobile: true,
      accessor: (video) => (
        <span className="tabular-nums">{formatNumber(video.views)}</span>
      ),
    },
    {
      id: 'likes',
      header: 'Likes',
      sortable: true,
      hideOnMobile: true,
      accessor: (video) => (
        <span className="tabular-nums">{formatNumber(video.likes)}</span>
      ),
    },
    {
      id: 'created_at',
      header: 'Date',
      sortable: true,
      hideOnMobile: true,
      accessor: (video) => (
        <span className="text-zinc-500">{formatRelativeTime(video.created_at)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      width: 'w-[50px]',
      accessor: (video) => (
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        >
          <Link href={`/video/${video.id}`}>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </Link>
          {video.video_url && (
            <a href={video.video_url} download target="_blank" rel="noopener noreferrer">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            </a>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onClick={() => handleDelete(video.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <ContentHeader
        title="Videos"
        subtitle={usingMockData ? "Demo mode - Supabase not configured" : "Manage your video content"}
        totalCount={videos.length}
        searchValue={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <BulkActionBar
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        isDeleting={isDeleting}
      />

      <div className="flex-1 overflow-auto p-6">
        <DataTable
          data={filteredVideos}
          columns={columns}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          sortConfig={sortConfig}
          onSort={setSortConfig}
          isLoading={isLoading}
          emptyMessage="No videos found. Create your first video to get started."
        />
      </div>
    </div>
  )
}
