import { Link2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AccountsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">TikTok Accounts</h1>
          <p className="text-sm text-zinc-500">
            Connect your TikTok accounts
          </p>
        </div>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90" disabled>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      <Card className="p-4 mb-4 bg-[#FE2C55]/10 border-[#FE2C55]/20">
        <p className="text-sm text-[#FE2C55]">
          TikTok account connection coming soon! You'll be able to automatically post generated videos.
        </p>
      </Card>

      <Card className="p-12 text-center">
        <Link2 className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
        <h3 className="font-medium mb-2">No accounts connected</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Connect your TikTok accounts to automatically post videos
        </p>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90" disabled>
          <Plus className="h-4 w-4 mr-2" />
          Connect TikTok
        </Button>
      </Card>
    </div>
  )
}
