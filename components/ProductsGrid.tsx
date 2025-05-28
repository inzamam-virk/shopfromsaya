"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/lib/types"

interface ProductsGridProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    featured?: string
    page?: string
  }
}

export default function ProductsGrid({ searchParams }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const page = Number.parseInt(searchParams.page || "1")
        const limit = 12
        const offset = (page - 1) * limit

        let query = supabase.from("products").select("*")

        // Apply filters
        if (searchParams.category) {
          const { data: categoryData } = await supabase
            .from("categories")
            .select("id")
            .ilike("name", `%${searchParams.category}%`)
            .single()

          if (categoryData) {
            query = query.eq("category_id", categoryData.id)
          }
        }

        if (searchParams.search) {
          query = query.or(
            `name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%,tags.cs.{${searchParams.search}}`,
          )
        }

        if (searchParams.featured === "true") {
          query = query.eq("featured", true)
        }

        // Apply sorting
        switch (searchParams.sort) {
          case "price_asc":
            query = query.order("price", { ascending: true })
            break
          case "price_desc":
            query = query.order("price", { ascending: false })
            break
          case "name_asc":
            query = query.order("name", { ascending: true })
            break
          case "name_desc":
            query = query.order("name", { ascending: false })
            break
          default:
            query = query.order("created_at", { ascending: false })
        }

        query = query.range(offset, offset + limit - 1)

        const { data, error } = await query

        if (error) {
          console.error("Error fetching products:", error)
          setError("Failed to load products")
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
        console.error("Error fetching products:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Products</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h2>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Products {searchParams.search && `for "${searchParams.search}"`}
        </h1>
        <p className="text-gray-600">{products.length} products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination would go here */}
    </div>
  )
}
