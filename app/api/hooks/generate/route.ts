import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productName,
      productDescription,
      productPrice,
      productBenefits,
      targetAudience,
      tone = 'casual', // casual, professional, humorous, urgent
    } = body

    if (!productDescription) {
      return NextResponse.json(
        { error: 'Product description is required' },
        { status: 400 }
      )
    }

    const prompt = `You are a viral TikTok content strategist. Generate 10 unique, scroll-stopping hooks for a TikTok video promoting this product.

PRODUCT INFO:
- Name: ${productName || 'Not specified'}
- Description: ${productDescription}
- Price: ${productPrice || 'Not specified'}
- Key Benefits: ${productBenefits?.join(', ') || 'Not specified'}
- Target Audience: ${targetAudience || 'General audience'}
- Tone: ${tone}

HOOK REQUIREMENTS:
1. Each hook must be under 10 words (TikTok attention span is 1-3 seconds)
2. Use proven viral patterns:
   - Curiosity gaps ("I can't believe this actually...")
   - Bold claims ("This changed my life in 3 days")
   - Direct questions ("Why is nobody talking about this?")
   - Controversial takes ("Unpopular opinion: this is better than...")
   - Story hooks ("I was today years old when...")
   - Fear of missing out ("Stop scrolling if you...")
   - Results-focused ("How I got [result] in [time]")
3. Make them feel authentic/UGC, not salesy
4. Vary the styles - mix questions, statements, and provocative takes
5. Include at least 2 hooks that create urgency

Return ONLY a JSON array of 10 hook objects with this structure:
[
  {
    "hook": "The actual hook text",
    "style": "curiosity|bold_claim|question|controversial|story|fomo|results",
    "whyItWorks": "Brief explanation of why this hook is effective"
  }
]

No markdown, no explanation, just the JSON array.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
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
    let hooks
    try {
      hooks = JSON.parse(textContent.text)
    } catch {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        hooks = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse hooks from response')
      }
    }

    return NextResponse.json({
      success: true,
      hooks,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    })
  } catch (error) {
    console.error('Hook generation error:', error)

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate hooks' },
      { status: 500 }
    )
  }
}
