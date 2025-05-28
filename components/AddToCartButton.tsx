"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import type { Product } from "@/lib/types"
import { ShoppingCart, Plus, Minus } from "lucide-react"

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, state } = useCart()

  const existingItem = state.items.find((item) => item.product.id === product.id)
  const currentQuantity = existingItem?.quantity || 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setQuantity(1)
  }

  const canAddMore = currentQuantity + quantity <= product.inventory_count

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-10 w-10 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!canAddMore}
            className="h-10 w-10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={product.inventory_count === 0 || !canAddMore}
          className="flex-1"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.inventory_count === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>

      {currentQuantity > 0 && <p className="text-sm text-gray-600">{currentQuantity} already in cart</p>}

      {!canAddMore && product.inventory_count > 0 && (
        <p className="text-sm text-red-600">Cannot add more than available stock ({product.inventory_count})</p>
      )}
    </div>
  )
}
