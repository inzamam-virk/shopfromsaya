"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Upload, X, ChevronUp, ChevronDown, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage.from("saya-product-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Upload error:", error)
        return null
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("saya-product-images").getPublicUrl(data.path)

      return publicUrl
    } catch (error) {
      console.error("Upload error:", error)
      return null
    }
  }

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      if (images.length >= maxImages) {
        alert(`Maximum ${maxImages} images allowed`)
        return
      }

      setUploading(true)
      const newImages: string[] = []

      for (let i = 0; i < Math.min(files.length, maxImages - images.length); i++) {
        const file = files[i]
        if (file.type.startsWith("image/")) {
          const url = await uploadImage(file)
          if (url) {
            newImages.push(url)
          }
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages])
      }
      setUploading(false)
    },
    [images, maxImages, onImagesChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newImages.length) {
      ;[newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
      onImagesChange(newImages)
    }
  }

  return (
    <div className="space-y-4">
      <Label>
        Product Images ({images.length}/{maxImages})
      </Label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
        } ${uploading ? "opacity-50" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Uploading images...</span>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 mb-2">Drag and drop images here, or click to select</p>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="image-upload"
              disabled={images.length >= maxImages}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              disabled={images.length >= maxImages || uploading}
            >
              Select Images
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              {maxImages - images.length} more image{maxImages - images.length !== 1 ? "s" : ""} allowed
            </p>
          </>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all" />

                {/* Controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Position Controls */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Primary Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Primary</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
