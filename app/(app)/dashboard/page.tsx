import Link from 'next/link'
import { Plus, Play, Video, Eye, Heart, Share2, TrendingUp, Sparkles, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatRelativeTime, getStatusVariant, getStatusLabel } from '@/lib/utils'
import type { Video as VideoType } from '@/types'

// Mock data for when Supabase isn't configured
const MOCK_VIDEOS: VideoType[] = [
  {
    id: '1',
    user_id: 'demo',
    title: 'Summer Sale Promo',
    prompt: 'Create a viral TikTok video promoting summer sale',
    video_url: null,
    thumbnail_url: null,
    status: 'completed',
    views: 12500,
    likes: 890,
    shares: 234,
    saves: 156,
    product_name: 'Summer Collection',
    product_price: '$29.99',
    product_link: null,
    product_benefits: ['Lightweight', 'Breathable'],
    brand_colors: ['#FE2C55'],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user_id: 'demo',
    title: 'New Product Launch',
    prompt: 'Showcase our new skincare product',
    video_url: null,
    thumbnail_url: null,
    status: 'processing',
    views: 0,
    likes: 0,
    shares: 0,
    saves: 0,
    product_name: 'Glow Serum',
    product_price: '$49.99',
    product_link: null,
    product_benefits: ['Hydrating', 'Anti-aging'],
    brand_colors: ['#FF6B6B'],
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    user_id: 'demo',
    title: 'Behind the Scenes',
    prompt: 'Show behind the scenes of our warehouse',
    video_url: null,
    thumbnail_url: null,
    status: 'completed',
    views: 8200,
    likes: 456,
    shares: 89,
    saves: 67,
    product_name: null,
    product_price: null,
    product_link: null,
    product_benefits: null,
    brand_colors: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

async function getVideos(): Promise<VideoType[]> {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url') {
    // Return mock data when Supabase isn't configured
    return MOCK_VIDEOS
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    return MOCK_VIDEOS
  }
}

export default async function DashboardPage() {
  const videos = await getVideos()

  // Calculate stats
  const totalVideos = videos.length
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0)
  const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0)
  const totalShares = videos.reduce((sum, v) => sum + v.shares, 0)
  const completedVideos = videos.filter((v) => v.status === 'completed').length
  const processingVideos = videos.filter((v) => v.status === 'processing').length

  // Get recent videos (last 5)
  const recentVideos = videos.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500">Welcome back! Here&apos;s your content overview.</p>
        </div>
        <Link href="/generate">
          <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
            <Plus className="h-4 w-4 mr-2" />
            New Video
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVideos}</p>
                <p className="text-xs text-zinc-500">Total Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
                <p className="text-xs text-zinc-500">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalLikes)}</p>
                <p className="text-xs text-zinc-500">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Share2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalShares)}</p>
                <p className="text-xs text-zinc-500">Total Shares</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Videos */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Videos</CardTitle>
            <Link href="/content/videos" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentVideos.length > 0 ? (
              <div className="space-y-3">
                {recentVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/video/${video.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Play className="h-4 w-4 text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{video.title || 'Untitled Video'}</p>
                      <p className="text-xs text-zinc-500">{formatRelativeTime(video.created_at)}</p>
                    </div>
                    <Badge variant={getStatusVariant(video.status)} className="shrink-0">
                      {getStatusLabel(video.status)}
                    </Badge>
                    {video.status === 'completed' && (
                      <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(video.views)}
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Play className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500">No videos yet</p>
                <Link href="/generate">
                  <Button size="sm" className="mt-3 bg-[#FE2C55] hover:bg-[#FE2C55]/90">
                    Create your first video
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/generate" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Generate Video</p>
                  <p className="text-xs text-zinc-500">Create AI-powered content</p>
                </div>
              </div>
            </Link>

            <Link href="/content/videos" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Video className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Manage Videos</p>
                  <p className="text-xs text-zinc-500">View and edit your content</p>
                </div>
              </div>
            </Link>

            <Link href="/analytics" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">View Analytics</p>
                  <p className="text-xs text-zinc-500">Track performance metrics</p>
                </div>
              </div>
            </Link>

            <Link href="/templates" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <FileText className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Templates</p>
                  <p className="text-xs text-zinc-500">Save and reuse prompts</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      {(processingVideos > 0 || completedVideos > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-zinc-600 dark:text-zinc-400">
                  {completedVideos} completed
                </span>
              </div>
              {processingVideos > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {processingVideos} processing
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
