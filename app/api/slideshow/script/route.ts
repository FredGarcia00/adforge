import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      hook,
      productName,
      productDescription,
      productPrice,
      productBenefits,
      slideshowType = 'listicle', // listicle, story, before_after, tutorial
      slideCount = 6,
    } = body

    if (!hook || !productDescription) {
      return NextResponse.json(
        { error: 'Hook and product description are required' },
        { status: 400 }
      )
    }

    const typeInstructions = {
      listicle: `Create a listicle-style slideshow (e.g., "5 reasons why...", "3 things you didn't know..."). Each slide reveals one point. End with a soft CTA.`,
      story: `Create a story-driven slideshow with a narrative arc: problem → discovery → transformation → result. Make it feel like a personal journey.`,
      before_after: `Create a transformation slideshow showing the before state (problems/pain points) transitioning to after state (benefits/results). Use contrast effectively.`,
      tutorial: `Create a how-to style slideshow showing steps to achieve a result using the product. Make each step clear and actionable.`,
    }

    const prompt = `You are a viral TikTok slideshow creator. Create a ${slideCount}-slide TikTok slideshow script.

HOOK TO USE: "${hook}"

PRODUCT INFO:
- Name: ${productName || 'This product'}
- Description: ${productDescription}
- Price: ${productPrice || 'Not specified'}
- Key Benefits: ${productBenefits?.join(', ') || 'Not specified'}

SLIDESHOW TYPE: ${slideshowType}
${typeInstructions[slideshowType as keyof typeof typeInstructions] || typeInstructions.listicle}

SLIDESHOW REQUIREMENTS:
1. Slide 1: The hook (attention grabber) - use the provided hook
2. Slides 2-${slideCount - 1}: Content slides with valuable info
3. Slide ${slideCount}: Soft CTA (not pushy, feels natural)
4. Each slide text: MAX 15 words (will be displayed as bold overlay text)
5. Text should be punchy, use line breaks for impact
6. Include emoji sparingly (1-2 per slide max)
7. Make viewers want to save/share the content
8. The slideshow should provide VALUE even without buying

For each slide, also provide:
- A brief image description for AI image generation (what visual should accompany the text)
- The image should NOT contain text (text will be overlaid separately)

Return ONLY a JSON object with this structure:
{
  "title": "Short title for this slideshow",
  "slides": [
    {
      "slideNumber": 1,
      "text": "The bold text overlay\\nWith line breaks",
      "imagePrompt": "Description for AI image generation - no text in image",
      "duration": 3
    }
  ],
  "totalDuration": 18,
  "hashtags": ["relevant", "hashtags", "for", "tiktok"]
}

No markdown, no explanation, just the JSON object.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract the text content
    const textContent = message.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Parse the JSON response
    let slideshow
    try {
      slideshow = JSON.parse(textContent.text)
    } catch {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        slideshow = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse slideshow from response')
      }
    }

    return NextResponse.json({
      success: true,
      slideshow,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    })
  } catch (error) {
    console.error('Slideshow script generation error:', error)

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate slideshow script' },
      { status: 500 }
    )
  }
}
