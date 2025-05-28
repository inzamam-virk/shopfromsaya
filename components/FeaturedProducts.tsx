"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/lib/types"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("featured", true).limit(4)

        if (error) {
          console.error("Error fetching featured products:", error)
          setError("Failed to load featured products")
        } else {
          // Add empty reviews array and default rating for each product
          const productsWithRating =
            data?.map((product) => ({
              ...product,
              reviews: [],
              average_rating: 0,
              category: null, // We'll skip category for now to avoid joins
            })) || []
          setProducts(productsWithRating)
        }
      } catch (err) {
        console.error("Error fetching featured products:", err)
        setError("Failed to load featured products")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No featured products available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
