"use client"

import type React from "react"
import { useState, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square bg-gray-200">
          <Image
            src={!imageError && product.images?.[0] ? product.images[0] : "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={product.featured}
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 text-xs rounded">Featured</div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

          {product.average_rating && product.average_rating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex">{renderStars(product.average_rating)}</div>
              <span className="ml-2 text-sm text-gray-600">({product.average_rating.toFixed(1)})</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <Button size="sm" onClick={handleAddToCart} className="bg-gray-900 hover:bg-gray-800">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {product.inventory_count <= 5 && product.inventory_count > 0 && (
            <p className="text-sm text-orange-600 mt-2">Only {product.inventory_count} left in stock</p>
          )}

          {product.inventory_count === 0 && <p className="text-sm text-red-600 mt-2">Out of stock</p>}
        </div>
      </div>
    </Link>
  )
})

export default ProductCard
