import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const HEYGEN_STATUS_URL = 'https://api.heygen.com/v1/video_status.get'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // TODO: Re-enable authentication later
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Get video from database (without user_id check for now)
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      // .eq('user_id', user.id) // TODO: Re-enable when auth is added back
      .single()

    if (fetchError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // If already completed or failed, return current status
    if (video.status === 'completed' || video.status === 'failed') {
      return NextResponse.json({
        status: video.status,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url,
      })
    }

    // Poll Heygen for status (video_url temporarily holds heygen_video_id)
    const heygenVideoId = video.video_url
    if (!heygenVideoId) {
      return NextResponse.json({
        status: video.status,
        video_url: null,
        thumbnail_url: null,
      })
    }

    const heygenResponse = await fetch(`${HEYGEN_STATUS_URL}?video_id=${heygenVideoId}`, {
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY!,
      },
    })

    if (!heygenResponse.ok) {
      console.error('Heygen status check failed')
      return NextResponse.json({
        status: video.status,
        video_url: null,
        thumbnail_url: null,
      })
    }

    const heygenData = await heygenResponse.json()
    const heygenStatus = heygenData.data.status

    // Map Heygen status to our status
    let newStatus = video.status
    let videoUrl = null
    let thumbnailUrl = null

    if (heygenStatus === 'completed') {
      newStatus = 'completed'
      videoUrl = heygenData.data.video_url
      thumbnailUrl = heygenData.data.thumbnail_url

      // Update database with final video URL
      await supabase
        .from('videos')
        .update({
          status: 'completed',
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
        })
        .eq('id', id)

    } else if (heygenStatus === 'failed') {
      newStatus = 'failed'

      await supabase
        .from('videos')
        .update({ status: 'failed' })
        .eq('id', id)
    }

    return NextResponse.json({
      status: newStatus,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
