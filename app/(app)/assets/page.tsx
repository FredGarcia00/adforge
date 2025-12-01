import { ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AssetsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Assets</h1>
          <p className="text-sm text-zinc-500">
            Your uploaded images and logos
          </p>
        </div>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
          <Plus className="h-4 w-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      <Card className="p-12 text-center">
        <ImageIcon className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
        <h3 className="font-medium mb-2">No assets yet</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Upload product images and brand logos to use in videos
        </p>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
          <Plus className="h-4 w-4 mr-2" />
          Upload Assets
        </Button>
      </Card>
    </div>
  )
}
