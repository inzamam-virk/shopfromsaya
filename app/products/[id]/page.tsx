import { notFound } from "next/navigation"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import AddToCartButton from "@/components/AddToCartButton"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product data
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name)
    `)
    .eq("id", params.id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch reviews separately to avoid RLS issues
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      user:users(full_name)
    `)
    .eq("product_id", params.id)
    .order("created_at", { ascending: false })

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
      : 0

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.featured && <Badge className="absolute top-4 left-4">Featured</Badge>}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
            {product.category && (
              <Badge variant="outline" className="mt-2">
                {product.category.name}
              </Badge>
            )}
          </div>

          {averageRating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-sm text-gray-600">
                ({averageRating.toFixed(1)}) • {reviews?.length || 0} review{reviews?.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Availability:</span>
              <span className={product.inventory_count > 0 ? "text-green-600" : "text-red-600"}>
                {product.inventory_count > 0 ? `${product.inventory_count} in stock` : "Out of stock"}
              </span>
            </div>

            {product.weight && (
              <div className="flex items-center justify-between text-sm">
                <span>Weight:</span>
                <span>{product.weight} kg</span>
              </div>
            )}
          </div>

          <AddToCartButton product={product} />

          {product.inventory_count <= 5 && product.inventory_count > 0 && (
            <p className="text-sm text-orange-600">⚠️ Only {product.inventory_count} left in stock - order soon!</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.user?.full_name || "Anonymous"}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  {review.comment && <p className="text-gray-600">{review.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
