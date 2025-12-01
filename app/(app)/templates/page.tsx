import { LayoutTemplate, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TemplatesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Templates</h1>
          <p className="text-sm text-zinc-500">
            Save and reuse your best prompts
          </p>
        </div>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <Card className="p-12 text-center">
        <LayoutTemplate className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
        <h3 className="font-medium mb-2">No templates yet</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Save your favorite prompts and styles as templates
        </p>
        <Button className="bg-[#FE2C55] hover:bg-[#FE2C55]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </Card>
    </div>
  )
}
