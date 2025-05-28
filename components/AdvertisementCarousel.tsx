"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { Advertisement } from "@/lib/types"

export default function AdvertisementCarousel() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const { data, error } = await supabase
          .from("advertisements")
          .select("*")
          .eq("active", true)
          .order("sort_order", { ascending: true })

        if (error) {
          console.error("Error fetching advertisements:", error)
          // Set default advertisements if fetch fails
          setAdvertisements([
            {
              id: "default-1",
              title: "Welcome to SAYA",
              image_url: "/placeholder.svg?height=400&width=1200",
              overlay_text: "Soft & Chic Fashion for Women",
              active: true,
              sort_order: 1,
              created_at: new Date().toISOString(),
            },
          ])
        } else {
          setAdvertisements(data || [])
        }
      } catch (error) {
        console.error("Error fetching advertisements:", error)
        // Set default advertisements if fetch fails
        setAdvertisements([
          {
            id: "default-1",
            title: "Welcome to SAYA",
            image_url: "/placeholder.svg?height=400&width=1200",
            overlay_text: "Soft & Chic Fashion for Women",
            active: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertisements()
  }, [])

  useEffect(() => {
    if (advertisements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1))
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [advertisements.length])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === advertisements.length - 1 ? 0 : currentIndex + 1)
  }

  if (loading) {
    return <div className="h-96 bg-gray-200 animate-pulse" />
  }

  if (advertisements.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to SAYA</h2>
          <p className="text-xl">Soft & Chic Fashion for Women</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-96 overflow-hidden">
      {advertisements.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentIndex ? "translate-x-0" : index < currentIndex ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className="relative h-full">
            <Image
              src={ad.image_url || "/placeholder.svg?height=400&width=1200"}
              alt={ad.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            {ad.overlay_text && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{ad.title}</h2>
                  <p className="text-xl md:text-2xl">{ad.overlay_text}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {advertisements.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {advertisements.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
