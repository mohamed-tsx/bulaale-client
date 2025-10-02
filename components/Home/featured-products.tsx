"use client"

import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Product, getImageUrl } from "@/lib/api"
import { productApi } from "@/lib/api"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Try to get featured products first, fallback to regular products
        try {
          const response = await productApi.getFeatured()
          if (response.data.success && response.data.data) {
            setProducts(response.data.data.slice(0, 5)) // Limit to 5 products
          } else {
            throw new Error('No featured products found')
          }
        } catch (featuredError) {
          // Fallback to getting regular products
          const response = await productApi.getAll({ limit: 5 })
          const productsData = response.data?.success ? response.data.products : response.data.products || []
          setProducts(productsData.slice(0, 5))
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError('Failed to load products')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-background border-t max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Best sellers in Baby Products</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden bg-card animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="h-5 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-background border-t max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load products. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-background border-t max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-12 md:py-16 bg-background border-t max-w-7xl mx-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Best sellers in Baby Products</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => {
            const firstVariant = product.variants?.[0]
            const price = firstVariant?.price || "0"
            const imageUrl = getImageUrl(product.coverImageUrl || firstVariant?.images?.[0]?.url)
            
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 bg-card cursor-pointer block"
              >
                <div className="relative aspect-square overflow-hidden bg-background">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <h4 className="text-sm text-foreground line-clamp-2 leading-snug">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">${price}</span>
                  </div>
                  {product.category && (
                    <p className="text-xs text-muted-foreground">{product.category.name}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
