import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/videos - Fetch all videos for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: videos, error } = await query

    if (error) {
      console.error('Fetch videos error:', error)
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
    }

    return NextResponse.json({ videos })

  } catch (error) {
    console.error('Videos GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/videos - Create a new video record (without generation)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      prompt,
      video_url,
      thumbnail_url,
      status = 'pending',
      product_name,
      product_price,
      product_link,
      product_benefits,
      brand_colors,
    } = body

    const { data: video, error } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        title,
        prompt,
        video_url,
        thumbnail_url,
        status,
        product_name,
        product_price,
        product_link,
        product_benefits,
        brand_colors,
      })
      .select()
      .single()

    if (error) {
      console.error('Create video error:', error)
      return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
    }

    return NextResponse.json({ video }, { status: 201 })

  } catch (error) {
    console.error('Videos POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
