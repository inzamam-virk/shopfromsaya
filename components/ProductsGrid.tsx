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
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const page = Number.parseInt(searchParams.page || "1")
        const limit = 12
        const offset = (page - 1) * limit

        let query = supabase.from("products").select("*, category:categories(name)", { count: "exact" })

        // Apply category filter
        if (searchParams.category) {
          const categoryFilter = searchParams.category.toLowerCase()
          
          // Handle different category formats
          let categoryQuery = query
          
          if (categoryFilter === "tops" || categoryFilter === "tops-and-sets") {
            // For tops category, we need to find the category by name
            const { data: categoryData } = await supabase
              .from("categories")
              .select("id")
              .or(`name.ilike.%tops%,name.ilike.%sets%`)
              .limit(1)
              .single()

            if (categoryData) {
              categoryQuery = query.eq("category_id", categoryData.id)
            }
          } else {
            // For other categories, try to match by name
            const { data: categoryData } = await supabase
              .from("categories")
              .select("id")
              .or(`name.ilike.%${categoryFilter}%`)
              .limit(1)
              .single()

            if (categoryData) {
              categoryQuery = query.eq("category_id", categoryData.id)
            }
          }
          
          query = categoryQuery
        }

        // Apply search filter
        if (searchParams.search) {
          const searchTerm = searchParams.search.toLowerCase()
          query = query.or(
            `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
          )
        }

        // Apply featured filter
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
          case "newest":
            query = query.order("created_at", { ascending: false })
            break
          default:
            // Default sorting: featured first, then by creation date
            query = query.order("featured", { ascending: false }).order("created_at", { ascending: false })
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1)

        const { data, error, count } = await query

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
            })) || []
          setProducts(productsWithRating)
          setTotalCount(count || 0)
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
        <p className="text-gray-600">
          {searchParams.search || searchParams.category || searchParams.featured
            ? "Try adjusting your search or filter criteria."
            : "No products are available at the moment."}
        </p>
      </div>
    )
  }

  // Get filter description
  const getFilterDescription = () => {
    const filters = []
    if (searchParams.search) filters.push(`"${searchParams.search}"`)
    if (searchParams.category) {
      const categoryName = searchParams.category.replace('-', ' ').replace('and', '&')
      filters.push(categoryName)
    }
    if (searchParams.featured === "true") filters.push("featured")
    
    return filters.length > 0 ? ` for ${filters.join(", ")}` : ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Products{getFilterDescription()}
        </h1>
        <p className="text-gray-600">{totalCount} product{totalCount !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination could be added here if needed */}
    </div>
  )
}
