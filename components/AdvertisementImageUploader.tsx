"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Upload, X, Loader2, AlertCircle } from "lucide-react"

interface AdvertisementImageUploaderProps {
  imageUrl: string
  onImageChange: (imageUrl: string) => void
}

export default function AdvertisementImageUploader({ imageUrl, onImageChange }: AdvertisementImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadProgress(`Uploading ${file.name}...`)

      // Validate file
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image")
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        throw new Error("File size must be less than 5MB")
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase()
      const fileName = `advertisement-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      console.log("Uploading advertisement image:", fileName, "Size:", file.size)

      // Upload to Supabase storage
      const { data, error } = await supabase.storage.from("saya-advertisement-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Supabase upload error:", error)
        throw new Error(`Upload failed: ${error.message}`)
      }

      console.log("Upload successful:", data)

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("saya-advertisement-images").getPublicUrl(data.path)

      console.log("Public URL:", publicUrl)

      if (!publicUrl) {
        throw new Error("Failed to get public URL")
      }

      return publicUrl
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    }
  }

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0] // Only take the first file for advertisements

      setUploading(true)
      setUploadError(null)
      setUploadProgress("")

      try {
        const url = await uploadImage(file)
        if (url) {
          onImageChange(url)
          setUploadProgress("Upload successful!")
          setTimeout(() => setUploadProgress(""), 2000)
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        setUploadError(`Upload failed: ${error.message}`)
      } finally {
        setUploading(false)
      }
    },
    [onImageChange],
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

  const removeImage = () => {
    onImageChange("")
  }

  const testStorageConnection = async () => {
    try {
      setUploadProgress("Testing storage connection...")
      const { data, error } = await supabase.storage.from("saya-advertisement-images").list("", { limit: 1 })

      if (error) {
        console.error("Storage test error:", error)
        setUploadError(`Storage connection failed: ${error.message}`)
      } else {
        console.log("Storage connection successful:", data)
        setUploadError(null)
        setUploadProgress("Storage connection successful!")
        setTimeout(() => setUploadProgress(""), 2000)
      }
    } catch (error) {
      console.error("Storage test error:", error)
      setUploadError(`Storage test failed: ${error.message}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Advertisement Image</Label>
        <Button type="button" variant="outline" size="sm" onClick={testStorageConnection} disabled={uploading}>
          Test Storage
        </Button>
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="text-sm text-red-700">{uploadError}</div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setUploadError(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Progress Display */}
      {uploadProgress && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">{uploadProgress}</div>
        </div>
      )}

      {/* Current Image Preview */}
      {imageUrl && (
        <div className="relative">
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Advertisement preview"
              fill
              className="object-cover"
              onError={(e) => {
                console.error("Image load error:", imageUrl)
                e.currentTarget.src = "/placeholder.svg?height=300&width=600"
              }}
            />
            <div className="absolute top-2 right-2">
              <Button type="button" size="sm" variant="destructive" onClick={removeImage} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

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
            <span>Uploading image...</span>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 mb-2">Drag and drop an image here, or click to select</p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="advertisement-image-upload"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("advertisement-image-upload")?.click()}
              disabled={uploading}
            >
              Select Image
            </Button>
            <p className="text-xs text-gray-500 mt-2">Recommended: 1200x400px or similar aspect ratio</p>
            <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</p>
          </>
        )}
      </div>

      {/* Debug Info */}
      <details className="text-xs text-gray-500">
        <summary className="cursor-pointer">Debug Info</summary>
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}</p>
          <p>Current Image: {imageUrl ? "✓ Set" : "✗ None"}</p>
          <p>Bucket: saya-advertisement-images</p>
        </div>
      </details>
    </div>
  )
}
