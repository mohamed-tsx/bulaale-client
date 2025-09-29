"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Grid3X3, 
  List,
  Package,
  Filter,
  ArrowLeft,
  Eye
} from "lucide-react";
import { api, Product, Category, getImageUrl } from "@/lib/api";
import Link from "next/link";
import { useErrorHandler } from "@/lib/contexts/error-handler-context";
import { ErrorAlert } from "@/components/ui/alert";
import { useProductsStore } from "@/lib/stores";

export default function ProductsPage() {
  const { handleError } = useErrorHandler();
  const {
    products,
    categories,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    sortBy,
    viewMode,
    setProducts,
    setCategories,
    setLoading,
    setError,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setViewMode,
    getFilteredProducts,
    clearError,
  } = useProductsStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      clearError();
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories")
      ]);
      
      const productsData = productsRes.data?.success ? productsRes.data.products : productsRes.data.products || productsRes.data || [];
      const categoriesData = categoriesRes.data?.success ? categoriesRes.data.categories : categoriesRes.data.categories || categoriesRes.data || [];
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      handleError(error, "Failed to load products and categories. Please try again later.");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = getFilteredProducts();


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <ErrorAlert 
              title="Failed to Load Products"
              description={error}
            />
            <Button onClick={fetchData} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">All Products</h1>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white border-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3 py-2"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3 py-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="px-4 py-2"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="px-4 py-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredProducts.length} products
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const availableVariants = product.variants.filter(
                variant => variant.active && variant.Inventory && variant.Inventory.quantity > 0
              );
              const isOutOfStock = availableVariants.length === 0;
              
              return (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 bg-white">
                  <div className="relative">
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer">
                        {product.coverImageUrl ? (
                          <img
                            src={getImageUrl(product.coverImageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.svg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </Link>
                    {isOutOfStock && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        {product.category?.name}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-900">{product.name}</h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        {availableVariants.length > 0 ? (
                          <span className="text-sm font-bold text-blue-600">
                            ${availableVariants[0].price}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-gray-400">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-3 py-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
                {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-md transition-all duration-300 bg-white">
                <div className="flex">
                  <div className="w-32 h-32 bg-gray-100 rounded-l-lg overflow-hidden flex-shrink-0">
                    {product.coverImageUrl ? (
                      <img
                        src={getImageUrl(product.coverImageUrl)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            {product.category?.name}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">4.8</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-base mb-1 text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-blue-600">
                              ${product.variants && product.variants.length > 0 ? product.variants[0]?.price || 0 : 0}
                            </span>
                            {product.variants && product.variants.length > 0 && product.variants[0]?.Inventory?.quantity && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({product.variants[0].Inventory.quantity} left)
                              </span>
                            )}
                          </div>
                          <Link href={`/product/${product.id}`}>
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
