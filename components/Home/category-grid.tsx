"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Category } from "@/lib/api"
import { categoryApi } from "@/lib/api"
import CategoryImage from "@/components/ui/CategoryImage"

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await categoryApi.getAll()
        const categoriesData = response.data?.success ? response.data.categories : response.data.categories || []
        setCategories(categoriesData.slice(0, 3)) // Limit to 3 categories for the grid
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories')
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-background max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Shop by categories</h3>
            <a href="#" className="text-sm text-accent hover:underline font-medium">
              All Departments →
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="overflow-hidden border rounded-lg bg-card animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
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
      <section className="py-12 md:py-16 bg-background max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-background max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }
    return (
      <section className="py-12 md:py-16 bg-background max-w-7xl mx-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Shop by categories</h3>
            <a href="#" className="text-sm text-accent hover:underline font-medium">
              All Departments →
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group overflow-hidden border rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer bg-card block"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <CategoryImage
                    imageUrl={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-base font-semibold text-foreground">{category.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Shop {category.name.toLowerCase()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }
  