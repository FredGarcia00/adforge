import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function ScheduledPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Scheduled</h1>
          <p className="text-sm text-zinc-500">
            Videos queued for posting
          </p>
        </div>
        <Link href="/generate">
          <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Video
          </Button>
        </Link>
      </div>

      <Card className="p-12 text-center">
        <Calendar className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
        <h3 className="font-medium mb-2">No scheduled videos</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Schedule videos to automatically post to TikTok
        </p>
        <Link href="/generate">
          <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
            <Plus className="h-4 w-4 mr-2" />
            Create & Schedule
          </Button>
        </Link>
      </Card>
    </div>
  )
}
