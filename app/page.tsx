import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AdvertisementCarousel from "@/components/AdvertisementCarousel"
import FeaturedProducts from "@/components/FeaturedProducts"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section with Advertisement Carousel */}
      <section className="relative">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <AdvertisementCarousel />
        </Suspense>
      </section>

      {/* Welcome Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Welcome to SAYA</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover our collection of soft and chic fashion designed for the modern woman. From elegant dresses to
          comfortable everyday wear, find your perfect style.
        </p>
        <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
          <Link href="/products">Shop Now</Link>
        </Button>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          }
        >
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Dresses", href: "/products?category=dresses", image: "/placeholder.svg?height=300&width=300" },
              { name: "Tops", href: "/products?category=tops", image: "/placeholder.svg?height=300&width=300" },
              { name: "Bottoms", href: "/products?category=bottoms", image: "/placeholder.svg?height=300&width=300" },
              {
                name: "Accessories",
                href: "/products?category=accessories",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-200 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
