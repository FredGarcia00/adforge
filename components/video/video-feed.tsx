'use client'

import { useState, useRef, useEffect } from 'react'
import { VideoCard } from './video-card'
import type { Video } from '@/types'

interface VideoFeedProps {
  videos: Video[]
}

export function VideoFeed({ videos }: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setActiveIndex(index)
          }
        })
      },
      {
        root: container,
        threshold: 0.5,
      }
    )

    const items = container.querySelectorAll('[data-index]')
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [videos])

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-7.5rem)] overflow-y-scroll snap-container no-scrollbar"
    >
      {videos.map((video, index) => (
        <div key={video.id} data-index={index}>
          <VideoCard video={video} isActive={index === activeIndex} />
        </div>
      ))}
    </div>
  )
}
