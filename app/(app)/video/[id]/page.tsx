import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Heart, Eye, Share2, Bookmark, RefreshCw, ExternalLink, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber, formatDate } from '@/lib/utils'

interface VideoDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: video } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single()

  if (!video) {
    notFound()
  }

  const { data: productImages } = await supabase
    .from('product_images')
    .select('*')
    .eq('video_id', id)
    .order('order')

  return (
    <div className="min-h-[calc(100vh-7.5rem)] pb-4">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-accent rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold truncate">{video.title}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Video preview */}
        <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden relative">
          {video.video_url ? (
            <video
              src={video.video_url}
              poster={video.thumbnail_url || undefined}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Play className="h-8 w-8" />
              </div>
              <p className="text-sm">
                {video.status === 'pending' && 'Waiting to process...'}
                {video.status === 'processing' && 'Processing video...'}
                {video.status === 'failed' && 'Video generation failed'}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                </div>
                <p className="font-semibold">{formatNumber(video.views)}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Heart className="h-4 w-4" />
                </div>
                <p className="font-semibold">{formatNumber(video.likes)}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Bookmark className="h-4 w-4" />
                </div>
                <p className="font-semibold">{formatNumber(video.saves)}</p>
                <p className="text-xs text-muted-foreground">Saves</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Share2 className="h-4 w-4" />
                </div>
                <p className="font-semibold">{formatNumber(video.shares)}</p>
                <p className="text-xs text-muted-foreground">Shares</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/generate?remix=${video.id}`}>
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Remix
            </Button>
          </Link>
          {video.video_url && (
            <a href={video.video_url} download target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </a>
          )}
        </div>

        {/* Details */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Prompt</p>
              <p className="text-sm">{video.prompt}</p>
            </div>

            {video.product_name && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Product</p>
                <p className="text-sm">{video.product_name}</p>
              </div>
            )}

            {video.product_price && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-sm">{video.product_price}</p>
              </div>
            )}

            {video.product_link && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Link</p>
                <a
                  href={video.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  {video.product_link}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {video.product_benefits && video.product_benefits.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Benefits</p>
                <ul className="text-sm list-disc list-inside">
                  {video.product_benefits.map((benefit: string, i: number) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-sm">{formatDate(video.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Product images */}
        {productImages && productImages.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-3">Product Images</p>
              <div className="grid grid-cols-3 gap-2">
                {productImages.map((image) => (
                  <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image.image_url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
