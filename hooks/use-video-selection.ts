'use client'

import { useState, useCallback, useMemo } from 'react'
import { Video } from '@/types'

export function useVideoSelection(videos: Video[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(videos.map((v) => v.id)))
  }, [videos])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const selectedVideos = useMemo(
    () => videos.filter((v) => selectedIds.has(v.id)),
    [videos, selectedIds]
  )

  const isAllSelected = useMemo(
    () => videos.length > 0 && videos.every((v) => selectedIds.has(v.id)),
    [videos, selectedIds]
  )

  const isPartiallySelected = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < videos.length,
    [videos.length, selectedIds.size]
  )

  return {
    selectedIds,
    setSelectedIds,
    selectAll,
    clearSelection,
    toggleSelection,
    isSelected,
    selectedVideos,
    isAllSelected,
    isPartiallySelected,
    selectedCount: selectedIds.size,
  }
}
