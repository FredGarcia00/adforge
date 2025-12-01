import { FolderKanban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CampaignsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Campaigns</h1>
          <p className="text-sm text-zinc-500">
            Organize videos into campaigns
          </p>
        </div>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Card className="p-12 text-center">
        <FolderKanban className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
        <h3 className="font-medium mb-2">No campaigns yet</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Group your videos into campaigns for better organization
        </p>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </Card>
    </div>
  )
}
