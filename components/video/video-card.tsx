'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark, RefreshCw, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber, formatRelativeTime } from '@/lib/utils'
import type { Video } from '@/types'

interface VideoCardProps {
  video: Video
  isActive?: boolean
}

export function VideoCard({ video, isActive = false }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <div className="relative h-[calc(100vh-7.5rem)] w-full bg-black snap-item">
      {/* Video Player */}
      <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
        {video.video_url ? (
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.thumbnail_url || undefined}
            className="h-full w-full object-contain"
            loop
            playsInline
            muted
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Play className="h-8 w-8" />
            </div>
            <p className="text-sm">Video processing...</p>
          </div>
        )}

        {/* Play/Pause overlay */}
        {!isPlaying && video.video_url && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
        >
          <div className={cn(
            'w-10 h-10 rounded-full bg-black/50 flex items-center justify-center',
            isLiked && 'text-primary'
          )}>
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
          </div>
          <span className="text-xs text-white">{formatNumber(video.likes + (isLiked ? 1 : 0))}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs text-white">{formatNumber(video.views)}</span>
        </button>

        <button
          onClick={handleSave}
          className="flex flex-col items-center gap-1"
        >
          <div className={cn(
            'w-10 h-10 rounded-full bg-black/50 flex items-center justify-center',
            isSaved && 'text-yellow-500'
          )}>
            <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
          </div>
          <span className="text-xs text-white">{formatNumber(video.saves + (isSaved ? 1 : 0))}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <Share2 className="h-5 w-5" />
          </div>
          <span className="text-xs text-white">{formatNumber(video.shares)}</span>
        </button>

        <Link
          href={`/generate?remix=${video.id}`}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <RefreshCw className="h-5 w-5" />
          </div>
          <span className="text-xs text-white">Remix</span>
        </Link>
      </div>

      {/* Bottom info overlay */}
      <div className="absolute bottom-0 left-0 right-16 p-4 gradient-bottom">
        <Link href={`/video/${video.id}`}>
          <h3 className="font-semibold text-white mb-1">{video.title}</h3>
          <p className="text-sm text-white/80 line-clamp-2 mb-2">{video.prompt}</p>
          {video.product_name && (
            <p className="text-xs text-white/60">Product: {video.product_name}</p>
          )}
          <p className="text-xs text-white/40 mt-1">{formatRelativeTime(video.created_at)}</p>
        </Link>
      </div>
    </div>
  )
}
