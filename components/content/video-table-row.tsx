'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, MoreHorizontal, Eye, Download, Trash2 } from 'lucide-react'
import { Video } from '@/types'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { formatNumber, formatRelativeTime, getStatusVariant, getStatusLabel } from '@/lib/utils'

interface VideoTableRowProps {
  video: Video
  onDelete?: (id: string) => void
}

export function VideoTableRow({ video, onDelete }: VideoTableRowProps) {
  return (
    <>
      {/* Thumbnail */}
      <div className="flex items-center gap-3">
        <Link href={`/video/${video.id}`} className="relative shrink-0">
          <div className="relative h-[45px] w-[80px] overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
            {video.thumbnail_url ? (
              <Image
                src={video.thumbnail_url}
                alt={video.title}
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

      {/* Status */}
      <Badge variant={getStatusVariant(video.status)}>
        {getStatusLabel(video.status)}
      </Badge>

      {/* Views */}
      <span className="tabular-nums">{formatNumber(video.views)}</span>

      {/* Likes */}
      <span className="tabular-nums">{formatNumber(video.likes)}</span>

      {/* Date */}
      <span className="text-zinc-500">{formatRelativeTime(video.created_at)}</span>

      {/* Actions */}
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
        <DropdownMenuItem destructive onClick={() => onDelete?.(video.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  )
}

// Column definitions for the video table
export const videoColumns = [
  {
    id: 'video',
    header: 'Video',
    accessor: () => null, // Custom render in row
    sortable: true,
    width: 'w-[300px]',
  },
  {
    id: 'status',
    header: 'Status',
    accessor: () => null,
    sortable: true,
  },
  {
    id: 'views',
    header: 'Views',
    accessor: () => null,
    sortable: true,
    hideOnMobile: true,
  },
  {
    id: 'likes',
    header: 'Likes',
    accessor: () => null,
    sortable: true,
    hideOnMobile: true,
  },
  {
    id: 'created_at',
    header: 'Date',
    accessor: () => null,
    sortable: true,
    hideOnMobile: true,
  },
  {
    id: 'actions',
    header: '',
    accessor: () => null,
    width: 'w-[50px]',
  },
]
