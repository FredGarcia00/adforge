'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = [...images, ...acceptedFiles].slice(0, maxImages)
      onImagesChange(newImages)
    },
    [images, onImagesChange, maxImages]
  )

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
          images.length >= maxImages && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-sm text-primary">Drop your images here...</p>
        ) : (
          <>
            <p className="text-sm text-foreground mb-1">
              Drag & drop product images
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse (max {maxImages} images)
            </p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={URL.createObjectURL(image)}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
