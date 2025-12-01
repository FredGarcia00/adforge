import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Heart, Share2, Bookmark, Video, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch completed videos from database
  let videos: { id: string; title: string; views: number; likes: number; shares: number; saves: number; thumbnail_url: string | null }[] = []
  if (user) {
    const { data } = await supabase
      .from('videos')
      .select('id, title, views, likes, shares, saves, thumbnail_url')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('views', { ascending: false })

    videos = data || []
  }

  const totalVideos = videos.length
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0)
  const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0)
  const totalShares = videos.reduce((sum, v) => sum + v.shares, 0)
  const totalSaves = videos.reduce((sum, v) => sum + v.saves, 0)

  const engagementRate = totalViews > 0
    ? (((totalLikes + totalShares + totalSaves) / totalViews) * 100).toFixed(1)
    : '0'

  const stats = [
    { label: 'Total Videos', value: totalVideos, icon: Video, color: 'text-blue-500' },
    { label: 'Total Views', value: formatNumber(totalViews), icon: Eye, color: 'text-green-500' },
    { label: 'Total Likes', value: formatNumber(totalLikes), icon: Heart, color: 'text-red-500' },
    { label: 'Total Shares', value: formatNumber(totalShares), icon: Share2, color: 'text-purple-500' },
    { label: 'Total Saves', value: formatNumber(totalSaves), icon: Bookmark, color: 'text-yellow-500' },
    { label: 'Engagement', value: `${engagementRate}%`, icon: TrendingUp, color: 'text-[#FE2C55]' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-zinc-500">
          Track your video performance
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={stat.color}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top performing videos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Performing Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {videos.length > 0 ? (
              videos.slice(0, 5).map((video, index) => (
                <div
                  key={video.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <span className="text-sm font-medium text-zinc-500 w-4">
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center shrink-0">
                    <Video className="h-4 w-4 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <p className="text-xs text-zinc-500">
                      {formatNumber(video.views)} views
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatNumber(video.likes)}</p>
                    <p className="text-xs text-zinc-500">likes</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">
                <Video className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No videos yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance chart placeholder */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Charts coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
