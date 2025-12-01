'use client'

import { useState, useMemo } from 'react'
import { Video, VideoStatus, SortConfig, SortDirection } from '@/types'

export function useVideoFilters(videos: Video[]) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VideoStatus[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'created_at',
    direction: 'desc',
  })

  const filteredVideos = useMemo(() => {
    let result = [...videos]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (video) =>
          video.title?.toLowerCase().includes(searchLower) ||
          video.product_name?.toLowerCase().includes(searchLower) ||
          video.prompt?.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((video) => statusFilter.includes(video.status))
    }

    // Apply sorting
    result.sort((a, b) => {
      const { column, direction } = sortConfig
      let aValue: string | number | Date = ''
      let bValue: string | number | Date = ''

      switch (column) {
        case 'title':
        case 'video':
          aValue = a.title || ''
          bValue = b.title || ''
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'views':
          aValue = a.views
          bValue = b.views
          break
        case 'likes':
          aValue = a.likes
          bValue = b.likes
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [videos, search, statusFilter, sortConfig])

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    handleSort,
    filteredVideos,
  }
}
