'use client'

import Link from 'next/link'
import { Video, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7.5rem)] px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Video className="h-10 w-10 text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Create your first AI-generated TikTok video and start building your content library.
      </p>

      <Link href="/generate">
        <Button size="lg" className="gap-2">
          <Sparkles className="h-5 w-5" />
          Create your first video
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>

      <div className="mt-12 grid grid-cols-1 gap-4 text-left max-w-sm">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">1</span>
          </div>
          <div>
            <h3 className="font-medium text-sm">Describe your product</h3>
            <p className="text-xs text-muted-foreground">Tell us what you want to sell</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">2</span>
          </div>
          <div>
            <h3 className="font-medium text-sm">Upload product photos</h3>
            <p className="text-xs text-muted-foreground">Add images for better results</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">3</span>
          </div>
          <div>
            <h3 className="font-medium text-sm">Generate with AI</h3>
            <p className="text-xs text-muted-foreground">Our AI creates your video</p>
          </div>
        </div>
      </div>
    </div>
  )
}
