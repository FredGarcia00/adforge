import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GeneratedHook, Slide, ImageStyle, SlideshowType } from '@/types'

// Helper function to download image and convert to base64
async function downloadImageAsBuffer(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Failed to download image: ${response.status}`)
      return null
    }
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('Error downloading image:', error)
    return null
  }
}

// Upload image to Supabase Storage and return permanent URL
async function uploadImageToStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  if (!supabase) return null

  try {
    // Upload to 'slideshow-images' bucket
    const { data, error } = await supabase.storage
      .from('slideshow-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (error) {
      console.error('Storage upload error:', error)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('slideshow-images')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading to storage:', error)
    return null
  }
}

// Process slides to persist images to Supabase Storage
async function persistSlideImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slides: Slide[],
  slideshowId: string
): Promise<Slide[]> {
  if (!supabase) return slides

  const persistedSlides: Slide[] = []

  for (const slide of slides) {
    if (slide.imageUrl && slide.imageUrl.startsWith('http')) {
      // Check if it's already a Supabase URL (already persisted)
      if (slide.imageUrl.includes('supabase')) {
        persistedSlides.push(slide)
        continue
      }

      // Download and re-upload to Supabase Storage
      const imageBuffer = await downloadImageAsBuffer(slide.imageUrl)
      if (imageBuffer) {
        const fileName = `${slideshowId}/slide-${slide.slideNumber}-${Date.now()}.webp`
        const permanentUrl = await uploadImageToStorage(supabase, imageBuffer, fileName)

        if (permanentUrl) {
          persistedSlides.push({
            ...slide,
            imageUrl: permanentUrl,
          })
          console.log(`Persisted slide ${slide.slideNumber} image to storage`)
          continue
        }
      }

      // If persistence failed, keep original URL (will expire but better than nothing)
      console.warn(`Failed to persist slide ${slide.slideNumber} image, keeping original URL`)
      persistedSlides.push(slide)
    } else {
      persistedSlides.push(slide)
    }
  }

  return persistedSlides
}

interface SaveSlideshowRequest {
  title: string
  hook: GeneratedHook
  slides: Slide[]
  imageStyle: ImageStyle
  slideshowType: SlideshowType
  hashtags: string[]
  totalDuration: number
  productName?: string
  productDescription?: string
  productPrice?: string
  productBenefits?: string[]
  targetAudience?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveSlideshowRequest = await request.json()

    const {
      title,
      hook,
      slides,
      imageStyle,
      slideshowType,
      hashtags,
      totalDuration,
      productName,
      productDescription,
      productPrice,
      productBenefits,
      targetAudience,
    } = body

    // Validate required fields
    if (!title || !hook || !slides || slides.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, hook, and slides are required' },
        { status: 400 }
      )
    }

    // Get Supabase client
    const supabase = await createClient()

    if (!supabase) {
      // Supabase not configured - return mock response for development
      console.warn('Supabase not configured - slideshow not saved to database')
      return NextResponse.json({
        success: true,
        message: 'Slideshow created (not saved - Supabase not configured)',
        video: {
          id: `mock-${Date.now()}`,
          title,
          status: 'completed',
          video_type: 'slideshow',
          slides,
          hook,
          image_style: imageStyle,
          slideshow_type: slideshowType,
          hashtags,
          total_duration: totalDuration,
          created_at: new Date().toISOString(),
        },
      })
    }

    // Generate a unique ID for this slideshow (used for storage folder)
    const slideshowId = `slideshow-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    // Persist images to Supabase Storage (converts temporary URLs to permanent ones)
    console.log('Persisting slide images to Supabase Storage...')
    const persistedSlides = await persistSlideImages(supabase, slides, slideshowId)

    // Determine the thumbnail from first slide with an image
    const thumbnailUrl = persistedSlides.find(s => s.imageUrl)?.imageUrl || null

    // Insert into videos table with persisted image URLs
    const { data, error } = await supabase
      .from('videos')
      .insert({
        title,
        prompt: hook.hook, // Use the hook as the main prompt
        video_type: 'slideshow',
        status: 'completed',
        thumbnail_url: thumbnailUrl,
        slides: persistedSlides,
        hook: hook,
        image_style: imageStyle,
        slideshow_type: slideshowType,
        hashtags,
        total_duration: totalDuration,
        product_name: productName || null,
        product_description: productDescription || null,
        product_price: productPrice || null,
        product_benefits: productBenefits || null,
        target_audience: targetAudience || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: `Failed to save slideshow: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Slideshow saved successfully',
      video: data,
    })
  } catch (error) {
    console.error('Save slideshow error:', error)
    return NextResponse.json(
      { error: 'Failed to save slideshow' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch saved slideshows
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      // Return mock data when Supabase is not configured
      return NextResponse.json({
        success: true,
        videos: [],
        message: 'Supabase not configured - no saved slideshows',
      })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error, count } = await supabase
      .from('videos')
      .select('*', { count: 'exact' })
      .eq('video_type', 'slideshow')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase fetch error:', error)
      return NextResponse.json(
        { error: `Failed to fetch slideshows: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      videos: data,
      total: count,
    })
  } catch (error) {
    console.error('Fetch slideshows error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slideshows' },
      { status: 500 }
    )
  }
}
