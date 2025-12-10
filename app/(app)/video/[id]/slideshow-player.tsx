'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, ImageOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Slide } from '@/types'

interface SlideshowPlayerProps {
  slides: Slide[]
}

export function SlideshowPlayer({ slides }: SlideshowPlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set())
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set())

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const slide = slides[currentSlide]
    const duration = (slide?.duration || 3) * 1000

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        nextSlide()
      } else {
        setIsPlaying(false)
        setCurrentSlide(0)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [isPlaying, currentSlide, slides, nextSlide])

  const slide = slides[currentSlide]

  if (!slide) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <p>No slides available</p>
      </div>
    )
  }

  const handleImageError = useCallback((slideNumber: number) => {
    setBrokenImages((prev) => new Set(prev).add(slideNumber))
    setLoadingImages((prev) => {
      const next = new Set(prev)
      next.delete(slideNumber)
      return next
    })
  }, [])

  const handleImageLoad = useCallback((slideNumber: number) => {
    setLoadingImages((prev) => {
      const next = new Set(prev)
      next.delete(slideNumber)
      return next
    })
    // If it was marked as broken but loaded, remove from broken
    setBrokenImages((prev) => {
      const next = new Set(prev)
      next.delete(slideNumber)
      return next
    })
  }, [])

  const isImageBroken = brokenImages.has(slide.slideNumber)
  const isImageLoading = loadingImages.has(slide.slideNumber)

  return (
    <div className="w-full h-full relative group">
      {/* Slide image */}
      {slide.imageUrl && !isImageBroken ? (
        <>
          {isImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center z-10">
              <RefreshCw className="h-8 w-8 text-zinc-500 animate-spin" />
            </div>
          )}
          <img
            src={slide.imageUrl}
            alt={`Slide ${slide.slideNumber}`}
            className="w-full h-full object-cover"
            onError={() => handleImageError(slide.slideNumber)}
            onLoad={() => handleImageLoad(slide.slideNumber)}
          />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center px-6">
          <ImageOff className="h-12 w-12 text-zinc-600 mb-3" />
          <p className="text-zinc-500 text-sm text-center mb-1">
            {isImageBroken ? 'Image expired or unavailable' : 'No image'}
          </p>
          {isImageBroken && (
            <p className="text-zinc-600 text-xs text-center">
              Re-generate the slideshow to get new images
            </p>
          )}
        </div>
      )}

      {/* Text overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30">
        <div className="absolute bottom-20 left-4 right-4">
          <p className="text-white text-lg font-bold leading-tight drop-shadow-lg">
            {slide.text}
          </p>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide indicator */}
      <div className="absolute top-4 right-4 px-2 py-1 rounded bg-black/50 text-white text-sm">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setIsPlaying(false)
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide
                ? 'w-6 bg-white'
                : 'w-1.5 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
