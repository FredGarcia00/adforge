'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/generate/image-upload'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, title: 'Prompt', description: 'Describe what you want to sell' },
  { id: 2, title: 'Images', description: 'Upload product photos' },
  { id: 3, title: 'Details', description: 'Add product information' },
  { id: 4, title: 'Style', description: 'Customize appearance' },
]

// Heygen avatar IDs - update with your actual avatars from Heygen dashboard
const avatars = [
  { id: 'Angela-inblackskirt-20220820', name: 'Angela' },
  { id: 'josh_lite3_20230714', name: 'Josh' },
  { id: 'Kayla-incasualsuit-20220818', name: 'Kayla' },
  { id: 'Tyler-incasualsuit-20220721', name: 'Tyler' },
]

export default function GeneratePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productLink, setProductLink] = useState('')
  const [benefits, setBenefits] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('Angela-inblackskirt-20220820')
  const [brandColor, setBrandColor] = useState('#FE2C55')
  const [error, setError] = useState('')
  const [generationStatus, setGenerationStatus] = useState('')

  const canProceed = () => {
    if (currentStep === 1) return prompt.trim().length > 0
    return true
  }

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
    else router.back()
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')
    setGenerationStatus('Starting generation...')

    try {
      // Call generate API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          productName,
          productPrice,
          productLink,
          productBenefits: benefits.split('\n').filter(b => b.trim()),
          brandColors: [brandColor],
          avatarId: selectedAvatar,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate video')
      }

      const { videoId } = await response.json()
      setGenerationStatus('Processing video...')

      // Poll for completion
      const pollStatus = async () => {
        const statusResponse = await fetch(`/api/videos/${videoId}/status`)
        const statusData = await statusResponse.json()

        if (statusData.status === 'completed') {
          setGenerationStatus('Video ready!')
          router.push(`/video/${videoId}`)
        } else if (statusData.status === 'failed') {
          throw new Error('Video generation failed')
        } else {
          // Continue polling
          setTimeout(pollStatus, 3000)
        }
      }

      await pollStatus()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
      setGenerationStatus('')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create Video</h1>
        <p className="text-sm text-zinc-500">
          Generate an AI-powered UGC video
        </p>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                    currentStep > step.id
                      ? 'bg-[#FE2C55] text-white'
                      : currentStep === step.id
                      ? 'bg-[#FE2C55] text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  )}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span className="text-xs mt-2 text-zinc-500">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    currentStep > step.id ? 'bg-[#FE2C55]' : 'bg-zinc-200 dark:bg-zinc-800'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <p className="text-sm text-zinc-500">{steps[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <Textarea
                placeholder="e.g., sell my LED face mask for anti-aging and acne treatment..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px]"
              />
              <div className="text-xs text-zinc-500">
                <p className="font-medium mb-1">Tips for better results:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Be specific about your product</li>
                  <li>Mention key benefits or features</li>
                  <li>Include target audience if relevant</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />
              <p className="text-xs text-zinc-500 text-center">
                Upload clear product photos for better video results
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Input
                label="Product Name"
                placeholder="LED Face Mask Pro"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <Input
                label="Price"
                placeholder="$49.99"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <Input
                label="Product Link"
                placeholder="https://yourstore.com/product"
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
              />
              <Textarea
                label="Key Benefits (one per line)"
                placeholder="Reduces wrinkles&#10;Clears acne&#10;FDA approved"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Choose Avatar</label>
                <div className="grid grid-cols-4 gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={cn(
                        'aspect-square rounded-lg border-2 overflow-hidden transition-colors',
                        selectedAvatar === avatar.id
                          ? 'border-[#FE2C55]'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-[#FE2C55]/50'
                      )}
                    >
                      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <span className="text-2xl">{avatar.name[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                  />
                  <Input
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status/Error messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {generationStatus && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-600 dark:text-blue-400 text-sm">
          {generationStatus}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={!canProceed() || isLoading}
            isLoading={isLoading}
            className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/90"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Video
          </Button>
        )}
      </div>
    </div>
  )
}
