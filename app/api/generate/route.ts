import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const HEYGEN_API_URL = 'https://api.heygen.com/v2/video/generate'

export async function POST(request: NextRequest) {
  try {
    // TODO: Re-enable authentication later
    // const supabase = await createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const {
      prompt,
      productName,
      productPrice,
      productLink,
      productBenefits,
      brandColors,
      avatarId = 'Angela-inblackskirt-20220820', // Default Heygen avatar
    } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Create video record in Supabase first (without user_id for now)
    const supabase = await createClient()
    const { data: video, error: insertError } = await supabase
      .from('videos')
      .insert({
        // user_id: user.id, // TODO: Re-enable when auth is added back
        title: productName || 'Untitled Video',
        prompt,
        status: 'processing',
        product_name: productName,
        product_price: productPrice,
        product_link: productLink,
        product_benefits: productBenefits,
        brand_colors: brandColors,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create video record' }, { status: 500 })
    }

    // Call Heygen API
    const heygenResponse = await fetch(HEYGEN_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: avatarId,
              avatar_style: 'normal',
            },
            voice: {
              type: 'text',
              input_text: prompt,
              voice_id: '1bd001e7e50f421d891986aad5158bc8', // Default voice
            },
          },
        ],
        dimension: {
          width: 1080,
          height: 1920, // Vertical TikTok format
        },
      }),
    })

    if (!heygenResponse.ok) {
      const errorData = await heygenResponse.json()
      console.error('Heygen API error:', errorData)

      // Update video status to failed
      await supabase
        .from('videos')
        .update({ status: 'failed' })
        .eq('id', video.id)

      return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 })
    }

    const heygenData = await heygenResponse.json()

    // Store Heygen video ID for status polling
    await supabase
      .from('videos')
      .update({
        video_url: heygenData.data.video_id // Temporarily store Heygen video ID here
      })
      .eq('id', video.id)

    return NextResponse.json({
      success: true,
      videoId: video.id,
      heygenVideoId: heygenData.data.video_id,
      status: 'processing',
    })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
