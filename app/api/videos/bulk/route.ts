import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/videos/bulk - Delete multiple videos
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: ids array is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Delete videos from database
    const { error } = await supabase
      .from('videos')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('Error deleting videos:', error)
      return NextResponse.json(
        { error: 'Failed to delete videos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/videos/bulk/export - Export multiple videos (placeholder)
export async function POST(request: NextRequest) {
  try {
    const { ids, action } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: ids array is required' },
        { status: 400 }
      )
    }

    if (action === 'export') {
      const supabase = await createClient()

      // Fetch videos to export
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .in('id', ids)

      if (error) {
        console.error('Error fetching videos for export:', error)
        return NextResponse.json(
          { error: 'Failed to fetch videos' },
          { status: 500 }
        )
      }

      // Return video data as JSON (could be extended to generate CSV/ZIP)
      return NextResponse.json({
        success: true,
        count: videos?.length || 0,
        videos: videos || [],
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Bulk action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
