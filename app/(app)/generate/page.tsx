'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Loader2,
  Zap,
  RefreshCw,
  Image as ImageIcon,
  Play,
  Pause,
  Download,
  Edit3,
  Trash2,
  Plus,
  Minus,
  Clock,
  GripVertical,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { GeneratedHook, Slideshow, SlideshowType, ImageStyle, Slide } from '@/types'

const steps = [
  { id: 1, title: 'Product', description: 'Describe what you want to sell' },
  { id: 2, title: 'Hooks', description: 'Choose your viral hook' },
  { id: 3, title: 'Slideshow', description: 'Generate your content' },
  { id: 4, title: 'Preview', description: 'Review and export' },
]

const slideshowTypes: { value: SlideshowType; label: string; description: string }[] = [
  { value: 'listicle', label: 'Listicle', description: '"5 reasons why..." format' },
  { value: 'story', label: 'Story', description: 'Personal journey narrative' },
  { value: 'before_after', label: 'Before/After', description: 'Transformation reveal' },
  { value: 'tutorial', label: 'Tutorial', description: 'Step-by-step guide' },
]

const imageStyles: { value: ImageStyle; label: string }[] = [
  { value: 'aesthetic', label: 'Aesthetic' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'vibrant', label: 'Vibrant' },
]

export default function GeneratePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  // Product info state
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productBenefits, setProductBenefits] = useState('')
  const [targetAudience, setTargetAudience] = useState('')

  // Hooks state
  const [hooks, setHooks] = useState<GeneratedHook[]>([])
  const [selectedHook, setSelectedHook] = useState<GeneratedHook | null>(null)
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false)

  // Slideshow state
  const [slideshowType, setSlideshowType] = useState<SlideshowType>('listicle')
  const [imageStyle, setImageStyle] = useState<ImageStyle>('aesthetic')
  const [slideshow, setSlideshow] = useState<Slideshow | null>(null)
  const [isGeneratingSlideshow, setIsGeneratingSlideshow] = useState(false)
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)

  // Customization state
  const [slideCount, setSlideCount] = useState(6)
  const [defaultDuration, setDefaultDuration] = useState(3)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [regeneratingSlideIndex, setRegeneratingSlideIndex] = useState<number | null>(null)

  // Preview state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPreviewSlide, setCurrentPreviewSlide] = useState(0)
  const [imageGenerationProgress, setImageGenerationProgress] = useState(0)

  // Save state
  const [isSaving, setIsSaving] = useState(false)
  const [savedVideoId, setSavedVideoId] = useState<string | null>(null)

  // Error state
  const [error, setError] = useState('')

  const canProceed = () => {
    if (currentStep === 1) return productDescription.trim().length > 10
    if (currentStep === 2) return selectedHook !== null
    if (currentStep === 3) return slideshow !== null && slideshow.slides.some(s => s.imageUrl)
    return true
  }

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
    else router.back()
  }

  // Generate 10 viral hooks
  const generateHooks = async () => {
    setIsGeneratingHooks(true)
    setError('')
    setHooks([])
    setSelectedHook(null)

    try {
      const response = await fetch('/api/hooks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription,
          productPrice,
          productBenefits: productBenefits.split('\n').filter(b => b.trim()),
          targetAudience,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate hooks')
      }

      const data = await response.json()
      setHooks(data.hooks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGeneratingHooks(false)
    }
  }

  // Generate slideshow script
  const generateSlideshow = async () => {
    if (!selectedHook) return

    setIsGeneratingSlideshow(true)
    setError('')
    setSlideshow(null)

    try {
      const response = await fetch('/api/slideshow/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hook: selectedHook.hook,
          productName,
          productDescription,
          productPrice,
          productBenefits: productBenefits.split('\n').filter(b => b.trim()),
          slideshowType,
          slideCount,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate slideshow')
      }

      const data = await response.json()
      // Apply default duration to all slides
      const slideshowWithDuration = {
        ...data.slideshow,
        slides: data.slideshow.slides.map((slide: Slide) => ({
          ...slide,
          duration: defaultDuration,
        })),
        totalDuration: data.slideshow.slides.length * defaultDuration,
      }
      setSlideshow(slideshowWithDuration)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGeneratingSlideshow(false)
    }
  }

  // Generate images for slideshow
  const generateImages = async () => {
    if (!slideshow) return

    setIsGeneratingImages(true)
    setError('')

    try {
      const response = await fetch('/api/slideshow/image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: slideshow.slides.map(s => ({
            slideNumber: s.slideNumber,
            imagePrompt: s.imagePrompt,
          })),
          style: imageStyle,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate images')
      }

      const data = await response.json()

      // Update slideshow with generated images
      setSlideshow({
        ...slideshow,
        slides: slideshow.slides.map(slide => {
          const imageResult = data.images.find(
            (img: { slideNumber: number; imageUrl: string }) => img.slideNumber === slide.slideNumber
          )
          return {
            ...slide,
            imageUrl: imageResult?.imageUrl || undefined,
          }
        }),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGeneratingImages(false)
    }
  }

  // Auto-generate hooks when entering step 2
  const handleEnterStep2 = () => {
    setCurrentStep(2)
    if (hooks.length === 0) {
      generateHooks()
    }
  }

  // Update slide text
  const updateSlideText = (slideIndex: number, newText: string) => {
    if (!slideshow) return
    const updatedSlides = [...slideshow.slides]
    updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], text: newText }
    setSlideshow({ ...slideshow, slides: updatedSlides })
  }

  // Update slide image prompt
  const updateSlideImagePrompt = (slideIndex: number, newPrompt: string) => {
    if (!slideshow) return
    const updatedSlides = [...slideshow.slides]
    updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], imagePrompt: newPrompt }
    setSlideshow({ ...slideshow, slides: updatedSlides })
  }

  // Update slide duration
  const updateSlideDuration = (slideIndex: number, newDuration: number) => {
    if (!slideshow) return
    const updatedSlides = [...slideshow.slides]
    updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], duration: newDuration }
    const totalDuration = updatedSlides.reduce((sum, slide) => sum + slide.duration, 0)
    setSlideshow({ ...slideshow, slides: updatedSlides, totalDuration })
  }

  // Delete a slide
  const deleteSlide = (slideIndex: number) => {
    if (!slideshow || slideshow.slides.length <= 2) return // Minimum 2 slides
    const updatedSlides = slideshow.slides.filter((_, i) => i !== slideIndex)
    // Renumber slides
    const renumberedSlides = updatedSlides.map((slide, i) => ({ ...slide, slideNumber: i + 1 }))
    const totalDuration = renumberedSlides.reduce((sum, slide) => sum + slide.duration, 0)
    setSlideshow({ ...slideshow, slides: renumberedSlides, totalDuration })
  }

  // Add a new slide
  const addSlide = () => {
    if (!slideshow || slideshow.slides.length >= 12) return // Maximum 12 slides
    const newSlide: Slide = {
      slideNumber: slideshow.slides.length + 1,
      text: 'New slide text\nEdit me!',
      imagePrompt: 'A beautiful product photo, professional lighting',
      duration: defaultDuration,
    }
    const updatedSlides = [...slideshow.slides, newSlide]
    const totalDuration = updatedSlides.reduce((sum, slide) => sum + slide.duration, 0)
    setSlideshow({ ...slideshow, slides: updatedSlides, totalDuration })
  }

  // Regenerate single image
  const regenerateSingleImage = async (slideIndex: number) => {
    if (!slideshow) return
    const slide = slideshow.slides[slideIndex]
    setRegeneratingSlideIndex(slideIndex)

    try {
      const response = await fetch('/api/slideshow/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: slide.imagePrompt,
          style: imageStyle,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate image')
      }

      const data = await response.json()
      const updatedSlides = [...slideshow.slides]
      updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], imageUrl: data.imageUrl }
      setSlideshow({ ...slideshow, slides: updatedSlides })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate image')
    } finally {
      setRegeneratingSlideIndex(null)
    }
  }

  // Preview player effect
  useEffect(() => {
    if (!isPlaying || !slideshow) return

    const currentSlide = slideshow.slides[currentPreviewSlide]
    const timer = setTimeout(() => {
      if (currentPreviewSlide < slideshow.slides.length - 1) {
        setCurrentPreviewSlide(currentPreviewSlide + 1)
      } else {
        setCurrentPreviewSlide(0) // Loop back
      }
    }, currentSlide.duration * 1000)

    return () => clearTimeout(timer)
  }, [isPlaying, currentPreviewSlide, slideshow])

  // Download images as zip
  const downloadImages = async () => {
    if (!slideshow) return

    // For now, download each image individually
    slideshow.slides.forEach((slide, i) => {
      if (slide.imageUrl) {
        const link = document.createElement('a')
        link.href = slide.imageUrl
        link.download = `slide-${i + 1}.png`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }

  // Save slideshow to database
  const saveSlideshow = async () => {
    if (!slideshow || !selectedHook) return

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/slideshow/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: slideshow.title,
          hook: selectedHook,
          slides: slideshow.slides,
          imageStyle,
          slideshowType,
          hashtags: slideshow.hashtags,
          totalDuration: slideshow.totalDuration,
          productName,
          productDescription,
          productPrice,
          productBenefits: productBenefits.split('\n').filter(b => b.trim()),
          targetAudience,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save slideshow')
      }

      const data = await response.json()
      setSavedVideoId(data.video?.id || null)
      return data.video
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save slideshow')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Done button - save and navigate
  const handleDone = async () => {
    if (!savedVideoId) {
      const saved = await saveSlideshow()
      if (saved) {
        router.push('/content/videos')
      }
    } else {
      router.push('/content/videos')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create Videos</h1>
        <p className="text-sm text-zinc-500">
          Generate scroll-stopping TikTok content in seconds
        </p>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    currentStep > step.id
                      ? 'bg-[#FE2C55] text-white'
                      : currentStep === step.id
                      ? 'bg-[#FE2C55] text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  )}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span className="text-xs mt-2 text-zinc-500">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    currentStep > step.id ? 'bg-[#FE2C55]' : 'bg-zinc-200 dark:bg-zinc-800'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Product Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your product</CardTitle>
            <p className="text-sm text-zinc-500">
              The more detail you provide, the better your hooks will be
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Product Name"
              placeholder="LED Face Mask Pro"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <Textarea
              label="Product Description *"
              placeholder="Describe your product in detail. What does it do? What problem does it solve? What makes it unique?"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                placeholder="$49.99"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <Input
                label="Target Audience"
                placeholder="Women 25-45 interested in skincare"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
            <Textarea
              label="Key Benefits (one per line)"
              placeholder="Reduces wrinkles in 2 weeks&#10;Clears acne&#10;FDA approved&#10;Used by 10,000+ customers"
              value={productBenefits}
              onChange={(e) => setProductBenefits(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Hook Selection */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#FE2C55]" />
                  Choose Your Hook
                </CardTitle>
                <p className="text-sm text-zinc-500 mt-1">
                  We generated 10 viral hooks - pick the one that resonates
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={generateHooks}
                disabled={isGeneratingHooks}
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', isGeneratingHooks && 'animate-spin')} />
                Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isGeneratingHooks ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#FE2C55] mb-4" />
                <p className="text-sm text-zinc-500">Generating 10 viral hooks...</p>
              </div>
            ) : hooks.length > 0 ? (
              <div className="grid gap-3">
                {hooks.map((hook, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedHook(hook)}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border-2 transition-all',
                      selectedHook === hook
                        ? 'border-[#FE2C55] bg-[#FE2C55]/5'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-[#FE2C55]/50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          "{hook.hook}"
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{hook.whyItWorks}</p>
                      </div>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      )}>
                        {hook.style.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>No hooks generated yet</p>
                <Button onClick={generateHooks} className="mt-4 bg-[#FE2C55] hover:bg-[#FE2C55]/90">
                  Generate Hooks
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Slideshow Generation */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Slideshow Settings</CardTitle>
              <p className="text-sm text-zinc-500">
                Configure how your slideshow will look
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Hook Display */}
              {selectedHook && (
                <div className="p-3 bg-[#FE2C55]/5 border border-[#FE2C55]/20 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Selected Hook:</p>
                  <p className="font-medium text-zinc-900 dark:text-white">"{selectedHook.hook}"</p>
                </div>
              )}

              {/* Slideshow Type */}
              <div>
                <label className="block text-sm font-medium mb-3">Slideshow Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {slideshowTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSlideshowType(type.value)}
                      disabled={!!slideshow}
                      className={cn(
                        'p-3 rounded-lg border-2 text-left transition-colors',
                        slideshowType === type.value
                          ? 'border-[#FE2C55] bg-[#FE2C55]/5'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-[#FE2C55]/50',
                        slideshow && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-zinc-500">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide Count & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Number of Slides</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSlideCount(Math.max(3, slideCount - 1))}
                      disabled={slideCount <= 3 || !!slideshow}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold w-8 text-center">{slideCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSlideCount(Math.min(10, slideCount + 1))}
                      disabled={slideCount >= 10 || !!slideshow}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">3-10 slides</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Duration per Slide</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultDuration(Math.max(1, defaultDuration - 1))}
                      disabled={defaultDuration <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold w-8 text-center">{defaultDuration}s</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultDuration(Math.min(10, defaultDuration + 1))}
                      disabled={defaultDuration >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">1-10 seconds</p>
                </div>
              </div>

              {/* Image Style */}
              <div>
                <label className="block text-sm font-medium mb-3">Image Style</label>
                <div className="flex gap-2 flex-wrap">
                  {imageStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setImageStyle(style.value)}
                      className={cn(
                        'px-4 py-2 rounded-lg border-2 text-sm transition-colors',
                        imageStyle === style.value
                          ? 'border-[#FE2C55] bg-[#FE2C55]/5 text-[#FE2C55]'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-[#FE2C55]/50'
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              {!slideshow && (
                <Button
                  onClick={generateSlideshow}
                  disabled={isGeneratingSlideshow}
                  className="w-full bg-[#FE2C55] hover:bg-[#FE2C55]/90"
                >
                  {isGeneratingSlideshow ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Slideshow Script
                    </>
                  )}
                </Button>
              )}

              {/* Reset Button */}
              {slideshow && (
                <Button
                  variant="outline"
                  onClick={() => setSlideshow(null)}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Slideshow Preview */}
          {slideshow && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{slideshow.title}</CardTitle>
                    <p className="text-sm text-zinc-500 mt-1">
                      {slideshow.slides.length} slides • {slideshow.totalDuration}s total
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSlide}
                      disabled={slideshow.slides.length >= 12}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slide
                    </Button>
                    <Button
                      onClick={generateImages}
                      disabled={isGeneratingImages}
                      className="bg-[#FE2C55] hover:bg-[#FE2C55]/90"
                    >
                      {isGeneratingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Generate All Images
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slideshow.slides.map((slide, index) => (
                    <div
                      key={slide.slideNumber}
                      className="flex gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50"
                    >
                      {/* Slide Preview */}
                      <div className="w-24 flex-shrink-0">
                        <div className="aspect-[9/16] rounded-lg border border-zinc-300 dark:border-zinc-600 overflow-hidden relative">
                          {slide.imageUrl ? (
                            <img
                              src={slide.imageUrl}
                              alt={`Slide ${slide.slideNumber}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-zinc-400" />
                            </div>
                          )}
                          {/* Slide number badge */}
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                            {slide.slideNumber}
                          </div>
                          {/* Regenerating indicator */}
                          {regeneratingSlideIndex === index && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Slide Content Editor */}
                      <div className="flex-1 space-y-3">
                        {editingSlideIndex === index ? (
                          <>
                            <div>
                              <label className="text-xs font-medium text-zinc-500 mb-1 block">Slide Text</label>
                              <Textarea
                                value={slide.text}
                                onChange={(e) => updateSlideText(index, e.target.value)}
                                className="min-h-[60px] text-sm"
                                placeholder="Enter slide text..."
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-zinc-500 mb-1 block">Image Prompt</label>
                              <Textarea
                                value={slide.imagePrompt}
                                onChange={(e) => updateSlideImagePrompt(index, e.target.value)}
                                className="min-h-[40px] text-sm"
                                placeholder="Describe the image..."
                              />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setEditingSlideIndex(null)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Done
                            </Button>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-white whitespace-pre-line">
                                {slide.text}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-500 line-clamp-2">
                              <span className="font-medium">Image:</span> {slide.imagePrompt}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Slide Controls */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Duration Control */}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-zinc-400" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateSlideDuration(index, Math.max(1, slide.duration - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium w-6 text-center">{slide.duration}s</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateSlideDuration(index, Math.min(10, slide.duration + 1))}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => setEditingSlideIndex(editingSlideIndex === index ? null : index)}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => regenerateSingleImage(index)}
                            disabled={regeneratingSlideIndex !== null}
                          >
                            <RefreshCw className={cn("h-3.5 w-3.5", regeneratingSlideIndex === index && "animate-spin")} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => deleteSlide(index)}
                            disabled={slideshow.slides.length <= 2}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {slideshow.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step 4: Preview & Export */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-[#FE2C55]" />
              Your Slideshow is Ready!
            </CardTitle>
            <p className="text-sm text-zinc-500">
              Preview your content and export for TikTok
            </p>
          </CardHeader>
          <CardContent>
            {slideshow && (
              <div className="space-y-6">
                {/* Large Animated Preview */}
                <div className="max-w-xs mx-auto">
                  <div className="aspect-[9/16] rounded-xl border-4 border-zinc-900 dark:border-zinc-700 overflow-hidden shadow-2xl relative">
                    {slideshow.slides[currentPreviewSlide]?.imageUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={slideshow.slides[currentPreviewSlide].imageUrl}
                          alt={`Slide ${currentPreviewSlide + 1}`}
                          className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-white text-lg font-bold text-center leading-tight">
                            {slideshow.slides[currentPreviewSlide].text.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < slideshow.slides[currentPreviewSlide].text.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <p className="text-zinc-500">No image for this slide</p>
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                      <div
                        className="h-full bg-[#FE2C55] transition-all"
                        style={{ width: `${((currentPreviewSlide + 1) / slideshow.slides.length) * 100}%` }}
                      />
                    </div>

                    {/* Slide counter */}
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {currentPreviewSlide + 1} / {slideshow.slides.length}
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPreviewSlide(Math.max(0, currentPreviewSlide - 1))}
                      disabled={currentPreviewSlide === 0}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsPlaying(!isPlaying)
                        if (!isPlaying) setCurrentPreviewSlide(0)
                      }}
                      className="bg-[#FE2C55] hover:bg-[#FE2C55]/90 w-24"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPreviewSlide(Math.min(slideshow.slides.length - 1, currentPreviewSlide + 1))}
                      disabled={currentPreviewSlide === slideshow.slides.length - 1}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Slide thumbnails */}
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {slideshow.slides.map((slide, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPreviewSlide(i)
                          setIsPlaying(false)
                        }}
                        className={cn(
                          "flex-shrink-0 w-10 aspect-[9/16] rounded border-2 overflow-hidden transition-all",
                          currentPreviewSlide === i
                            ? "border-[#FE2C55] ring-2 ring-[#FE2C55]/30"
                            : "border-zinc-300 dark:border-zinc-600 opacity-60 hover:opacity-100"
                        )}
                      >
                        {slide.imageUrl ? (
                          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Slideshow Summary</h3>
                  <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>• {slideshow.slides.length} slides</li>
                    <li>• {slideshow.totalDuration} seconds total duration</li>
                    <li>• {slideshow.slides.filter(s => s.imageUrl).length} images generated</li>
                    <li>• Type: {slideshowType}</li>
                    <li>• Style: {imageStyle}</li>
                  </ul>
                </div>

                {/* Hashtags */}
                {slideshow.hashtags && slideshow.hashtags.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Suggested Hashtags</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 break-all">
                      {slideshow.hashtags.map(tag => `#${tag}`).join(' ')}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        navigator.clipboard.writeText(slideshow.hashtags.map(tag => `#${tag}`).join(' '))
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                )}

                {/* Export Options */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={downloadImages}
                    disabled={!slideshow.slides.some(s => s.imageUrl)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Images
                  </Button>
                  <Button
                    className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
                    onClick={() => {
                      // TODO: Create video with FFmpeg or similar
                      alert('Video export coming in Phase 2! For now, download images and use CapCut or TikTok\'s editor.')
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Create Video
                  </Button>
                </div>

                {/* Save Status */}
                {savedVideoId && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
                    <Check className="h-4 w-4 inline mr-2" />
                    Slideshow saved successfully!
                  </div>
                )}

                {/* Save Button */}
                {!savedVideoId && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={saveSlideshow}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Slideshow
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep === 1 && (
          <Button
            onClick={handleEnterStep2}
            disabled={!canProceed()}
            className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
          >
            Generate 10 Hooks
            <Zap className="h-4 w-4 ml-2" />
          </Button>
        )}

        {currentStep === 2 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
          >
            Use This Hook
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}

        {currentStep === 3 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
          >
            Preview
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}

        {currentStep === 4 && (
          <Button
            onClick={handleDone}
            disabled={isSaving}
            className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {savedVideoId ? 'Done' : 'Save & Done'}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
