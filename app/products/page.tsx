import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ProductsGrid from "@/components/ProductsGrid"
import ProductFilters from "@/components/ProductFilters"

interface ProductsPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    featured?: string
    page?: string
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full" />
                  ))}
                </div>
              </div>
            }
          >
            <ProductsGrid searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
