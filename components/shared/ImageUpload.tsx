import { useUploadThing } from '@/lib/uploadthing'
import { X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface ImageUploadProps {
  onAdd: (url: string) => void
  onRemove: () => void
  value: string
  onChange: (files: File[]) => void
}

const ImageUpload = ({ onAdd, onRemove, value, onChange }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const { startUpload } = useUploadThing('imageUploader')

  const handleUpload = async (files: File[]) => {
    setIsUploading(true)
    try {
      const uploadedImages = await startUpload(files)
      if (!uploadedImages) {
        throw new Error('Failed to upload image')
      }
      const imageUrl = uploadedImages[0].url
      onAdd(imageUrl)
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {value && (
        <div className="relative w-40 h-40">
          <Image
            src={value}
            alt="Upload"
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={onRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            if (files.length > 0) {
              onChange(files)
              handleUpload(files)
            }
          }}
          disabled={isUploading}
          className="cursor-pointer"
        />
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Uploading...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload 