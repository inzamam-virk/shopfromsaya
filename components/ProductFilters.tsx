"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/lib/types"

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").order("name")

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    params.delete("page") // Reset to first page when filtering

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-medium mb-3">Sort By</h4>
        <Select
          value={searchParams.get("sort") || "default"}
          onValueChange={(value) => updateFilters("sort", value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
            <SelectItem value="name_desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={searchParams.get("category") === category.name.toLowerCase()}
                onCheckedChange={(checked) => updateFilters("category", checked ? category.name.toLowerCase() : null)}
              />
              <label htmlFor={category.id} className="text-sm cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div>
        <h4 className="font-medium mb-3">Special</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={searchParams.get("featured") === "true"}
            onCheckedChange={(checked) => updateFilters("featured", checked ? "true" : null)}
          />
          <label htmlFor="featured" className="text-sm cursor-pointer">
            Featured Products
          </label>
        </div>
      </div>
    </div>
  )
}
