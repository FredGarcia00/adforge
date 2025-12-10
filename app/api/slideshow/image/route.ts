import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Helper to extract URL from Replicate output
// Replicate can return strings, FileOutput objects, or arrays
function extractImageUrl(output: unknown): string | null {
  if (!output) return null

  // If it's an array, get the first element
  if (Array.isArray(output)) {
    return extractImageUrl(output[0])
  }

  // If it's already a string URL
  if (typeof output === 'string') {
    return output
  }

  // If it's a FileOutput object with url property
  if (typeof output === 'object' && output !== null) {
    const obj = output as Record<string, unknown>

    // Check for url property
    if ('url' in obj && typeof obj.url === 'string') {
      return obj.url
    }

    // Check for href property
    if ('href' in obj && typeof obj.href === 'string') {
      return obj.href
    }

    // Try toString() - FileOutput objects often have this
    if (typeof obj.toString === 'function') {
      const str = obj.toString()
      if (str && str !== '[object Object]' && str.startsWith('http')) {
        return str
      }
    }
  }

  console.error('Could not extract URL from output:', output)
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      style = 'realistic', // realistic, aesthetic, minimal, vibrant
      aspectRatio = '9:16', // TikTok vertical format
    } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Image prompt is required' },
        { status: 400 }
      )
    }

    // Style modifiers for different aesthetics
    const styleModifiers = {
      realistic: 'photorealistic, high quality, professional photography, natural lighting',
      aesthetic: 'aesthetic, soft colors, dreamy, instagram style, lifestyle photography',
      minimal: 'minimalist, clean background, simple composition, modern',
      vibrant: 'vibrant colors, bold, eye-catching, high contrast, energetic',
    }

    // Build the enhanced prompt
    const enhancedPrompt = `${prompt}, ${styleModifiers[style as keyof typeof styleModifiers] || styleModifiers.realistic}, vertical format 9:16, no text, no watermarks`

    // Calculate dimensions for aspect ratio
    const dimensions = {
      '9:16': { width: 768, height: 1344 }, // TikTok/Reels vertical
      '1:1': { width: 1024, height: 1024 }, // Square
      '16:9': { width: 1344, height: 768 }, // Landscape
    }

    const { width, height } = dimensions[aspectRatio as keyof typeof dimensions] || dimensions['9:16']

    // Use FLUX Schnell for fast generation (good balance of speed/quality)
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: enhancedPrompt,
          width,
          height,
          num_outputs: 1,
          num_inference_steps: 4, // Schnell is optimized for 4 steps
          go_fast: true,
        },
      }
    )

    // Extract the URL from the output
    const imageUrl = extractImageUrl(output)

    if (!imageUrl) {
      console.error('Failed to extract image URL from output:', output)
      return NextResponse.json(
        { error: 'Failed to extract image URL from response' },
        { status: 500 }
      )
    }

    console.log('Generated image URL:', imageUrl)

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
    })
  } catch (error) {
    console.error('Image generation error:', error)

    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Batch generate images for multiple slides (sequential to respect rate limits)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      slides, // Array of { slideNumber, imagePrompt }
      style = 'aesthetic',
    } = body

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { error: 'Slides array is required' },
        { status: 400 }
      )
    }

    const styleModifiers = {
      realistic: 'photorealistic, high quality, professional photography, natural lighting',
      aesthetic: 'aesthetic, soft colors, dreamy, instagram style, lifestyle photography',
      minimal: 'minimalist, clean background, simple composition, modern',
      vibrant: 'vibrant colors, bold, eye-catching, high contrast, energetic',
    }

    const styleModifier = styleModifiers[style as keyof typeof styleModifiers] || styleModifiers.aesthetic

    // Generate images SEQUENTIALLY to avoid rate limits
    const results: Array<{
      slideNumber: number
      imageUrl: string | null
      success: boolean
      error?: string
    }> = []

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as { slideNumber: number; imagePrompt: string }
      const enhancedPrompt = `${slide.imagePrompt}, ${styleModifier}, vertical format 9:16, no text, no watermarks`

      try {
        const output = await replicate.run(
          'black-forest-labs/flux-schnell',
          {
            input: {
              prompt: enhancedPrompt,
              width: 768,
              height: 1344,
              num_outputs: 1,
              num_inference_steps: 4,
              go_fast: true,
            },
          }
        )

        const imageUrl = extractImageUrl(output)

        if (!imageUrl) {
          console.error(`Failed to extract URL for slide ${slide.slideNumber}, output:`, output)
          results.push({
            slideNumber: slide.slideNumber,
            imageUrl: null,
            success: false,
            error: 'Failed to extract image URL',
          })
          continue
        }

        results.push({
          slideNumber: slide.slideNumber,
          imageUrl,
          success: true,
        })

        console.log(`Generated image ${i + 1}/${slides.length} for slide ${slide.slideNumber}: ${imageUrl.substring(0, 50)}...`)

        // Add delay between requests to respect rate limits (except for last image)
        if (i < slides.length - 1) {
          await delay(2000) // 2 second delay between images
        }
      } catch (error) {
        console.error(`Error generating image for slide ${slide.slideNumber}:`, error)

        // Check if it's a rate limit error and wait longer
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          console.log('Rate limited, waiting 15 seconds before retry...')
          await delay(15000)

          // Retry once after waiting
          try {
            const retryOutput = await replicate.run(
              'black-forest-labs/flux-schnell',
              {
                input: {
                  prompt: enhancedPrompt,
                  width: 768,
                  height: 1344,
                  num_outputs: 1,
                  num_inference_steps: 4,
                  go_fast: true,
                },
              }
            )
            const retryImageUrl = extractImageUrl(retryOutput)
            if (retryImageUrl) {
              results.push({
                slideNumber: slide.slideNumber,
                imageUrl: retryImageUrl,
                success: true,
              })
              console.log(`Retry successful for slide ${slide.slideNumber}: ${retryImageUrl.substring(0, 50)}...`)
              continue
            } else {
              console.error(`Retry succeeded but failed to extract URL for slide ${slide.slideNumber}`)
            }
          } catch (retryError) {
            console.error(`Retry failed for slide ${slide.slideNumber}:`, retryError)
          }
        }

        results.push({
          slideNumber: slide.slideNumber,
          imageUrl: null,
          success: false,
          error: 'Failed to generate image',
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: failCount === 0,
      images: results,
      summary: {
        total: slides.length,
        successful: successCount,
        failed: failCount,
      },
    })
  } catch (error) {
    console.error('Batch image generation error:', error)

    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    )
  }
}
