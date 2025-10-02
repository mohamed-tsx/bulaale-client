"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Product, getImageUrl, productApi } from "@/lib/api"
import { useCartStore } from "@/lib/stores/cart-store"

/* ====================== Helpers ====================== */

const unique = <T,>(arr: T[]) => Array.from(new Set(arr)).filter(Boolean) as T[]

/** Color name → HEX fallback for pretty swatches */
const COLOR_MAP: Record<string, string> = {
  "Deep Teal": "#004a5f",
  "Primary Green": "#16b088",
  Black: "#000000",
  White: "#ffffff",
  Gray: "#9ca3af",
  "Light Gray": "#e5e7eb",
  Navy: "#001f3f",
  Blue: "#1d4ed8",
  Red: "#dc2626",
  Yellow: "#f59e0b",
  Pink: "#ec4899",
  Beige: "#f5f5dc",
}
const getSwatchColor = (color?: string | null) => (color ? COLOR_MAP[color] ?? color : "#e5e7eb")

/** Prefer in-stock when resolving a variant */
const findMatchingVariant = (size: string | null, color: string | null, variants: any[]) => {
  if (!variants?.length) return null
  const inStock = variants.filter((v) => (v?.Inventory?.quantity ?? 0) > 0)
  const pool = inStock.length ? inStock : variants
  return (
    pool.find((v) => v.size === size && v.color === color) ||
    pool.find((v) => v.size === size || v.color === color) ||
    pool[0]
  )
}

/** Stock-aware availability lists */
const getAvailableSizes = (product: Product, color: string | null) =>
  unique(
    (product.variants || [])
      .filter((v) => (v.Inventory?.quantity || 0) > 0 && (color ? v.color === color : true))
      .map((v) => v.size as string)
  )

const getAvailableColors = (product: Product, size: string | null) =>
  unique(
    (product.variants || [])
      .filter((v) => (v.Inventory?.quantity || 0) > 0 && (size ? v.size === size : true))
      .map((v) => v.color as string)
  )

/** Checks for disabling chips - show all options that have any stock */
const isSizeAvailable = (product: Product, size: string, selectedColor: string | null) =>
  (product.variants || []).some(
    (v) =>
      v.size === size &&
      (v.Inventory?.quantity || 0) > 0
  )

const isColorAvailable = (product: Product, color: string, selectedSize: string | null) =>
  (product.variants || []).some(
    (v) =>
      v.color === color &&
      (v.Inventory?.quantity || 0) > 0
  )

/* ====================== Page ====================== */

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  // ----- Hooks (declare all before any return) -----
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null)

  const { addItem } = useCartStore()

  // ----- Fetch product -----
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!id) {
          setError("Invalid product id")
          return
        }

        const response = await productApi.getById(id as string)
        if (response?.data?.success && response?.data?.product) {
          const productData = response.data.product as Product
          setProduct(productData)

          if (productData.variants?.length) {
            // Find the first in-stock variant, or fall back to any variant
            const inStockVariants = productData.variants.filter((v) => (v.Inventory?.quantity || 0) > 0)
            const firstVariant = inStockVariants[0] || productData.variants[0]
            
            setSelectedVariant(firstVariant)
            setSelectedSize(firstVariant.size || null)
            setSelectedColor(firstVariant.color || null)
            const vImg = firstVariant?.images?.[0]?.url
            if (vImg) setActiveImageUrl(getImageUrl(vImg))
          } else {
            setSelectedVariant(null)
            setSelectedSize(null)
            setSelectedColor(null)
          }
        } else {
          setError("Product not found")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // ----- Resolve matching variant when selections change (prefer in-stock) -----
  useEffect(() => {
    if (!product?.variants?.length) return
    const mv = findMatchingVariant(selectedSize, selectedColor, product.variants)
    if (mv && mv.id !== selectedVariant?.id) {
      setSelectedVariant(mv)
      const stock = mv?.Inventory?.quantity ?? 0
      setQuantity((q) => Math.max(1, Math.min(q, Math.max(1, stock))))
      const vImg = mv?.images?.[0]?.url
      if (vImg) setActiveImageUrl(getImageUrl(vImg))
    }
  }, [product, selectedSize, selectedColor]) // no selectedVariant?.id to avoid loops

  // ----- Handlers that auto-adjust the opposite option if needed -----
  const handleSelectSize = (newSize: string) => {
    if (!product) return
    
    setSelectedSize(newSize)
    
    // Only auto-select color if current color is not available for this size
    const colorsForSize = getAvailableColors(product, newSize)
    if (!selectedColor || !colorsForSize.includes(selectedColor)) {
      const nextColor = colorsForSize[0] ?? null
      setSelectedColor(nextColor)
    }

    // Find matching variant with current selections
    const mv = findMatchingVariant(newSize, selectedColor, product.variants || [])
    if (mv && mv.id !== selectedVariant?.id) {
      setSelectedVariant(mv)
      const stock = mv?.Inventory?.quantity ?? 0
      setQuantity((q) => Math.max(1, Math.min(q, Math.max(1, stock))))
      const vImg = mv?.images?.[0]?.url
      if (vImg) setActiveImageUrl(getImageUrl(vImg))
    }
  }

  const handleSelectColor = (newColor: string) => {
    if (!product) return
    
    setSelectedColor(newColor)
    
    // Only auto-select size if current size is not available for this color
    const sizesForColor = getAvailableSizes(product, newColor)
    if (!selectedSize || !sizesForColor.includes(selectedSize)) {
      const nextSize = sizesForColor[0] ?? null
      setSelectedSize(nextSize)
    }

    // Find matching variant with current selections
    const mv = findMatchingVariant(selectedSize, newColor, product.variants || [])
    if (mv && mv.id !== selectedVariant?.id) {
      setSelectedVariant(mv)
      const stock = mv?.Inventory?.quantity ?? 0
      setQuantity((q) => Math.max(1, Math.min(q, Math.max(1, stock))))
      const vImg = mv?.images?.[0]?.url
      if (vImg) setActiveImageUrl(getImageUrl(vImg))
    }
  }

  // ----- Images -----
  const allImages: string[] = useMemo(() => {
    if (!product) return []
    const imgs = [
      ...(product.images || []).map((img) => img.url),
      ...(product.variants || []).flatMap((v) => (v.images || []).map((img) => img.url)),
    ]
      .filter(Boolean)
      .map((u) => getImageUrl(u as string))
    return unique(imgs)
  }, [product])

  const heroImage = useMemo(() => {
    if (activeImageUrl) return activeImageUrl
    if (!product) return "/placeholder.png"
    return getImageUrl(
      product.coverImageUrl ||
        allImages[0] ||
        product.variants?.[0]?.images?.[0]?.url ||
        "/placeholder.png"
    )
  }, [product, allImages, activeImageUrl])

  // ----- Derived / misc -----
  const currentPrice = selectedVariant?.price ?? product?.variants?.[0]?.price ?? "0"
  const isInStock =
    (selectedVariant?.Inventory?.quantity ?? 0) > 0 ||
    (product?.variants || []).some((v) => (v.Inventory?.quantity ?? 0) > 0)

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return
    setIsAddingToCart(true)
    try {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        price: Number(selectedVariant.price),
        quantity,
        image: getImageUrl(product.coverImageUrl || selectedVariant.images?.[0]?.url),
        variant: {
          size: selectedVariant.size,
          color: selectedVariant.color,
          optionSummary: selectedVariant.optionSummary,
          sku: selectedVariant.sku,
        },
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  /* ====================== Early returns ====================== */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 animate-pulse" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Oops!</h2>
          <p className="text-gray-600">{error ?? "Product not found."}</p>
        </div>
      </div>
    )
  }

  /* ====================== Render ====================== */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                <Image src={heroImage} alt={product.name} fill className="object-cover" priority />
                {!isInStock && (
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                    Out of Stock
                  </Badge>
                )}
                {product.category && (
                  <Badge className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600">
                    {product.category.name}
                  </Badge>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {allImages.slice(0, 8).map((image, index) => {
                    const isActive = image === heroImage
                    return (
                      <button
                        key={index}
                        onClick={() => setActiveImageUrl(image)}
                        className={[
                          "relative aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 transition-all",
                          isActive
                            ? "border-orange-500 ring-2 ring-orange-200"
                            : "border-gray-200 hover:border-orange-400",
                        ].join(" ")}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
                {product.brand && (
                  <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">${currentPrice}</span>
                {selectedVariant?.Inventory && (
                  <span className="text-sm text-gray-500">
                    ({selectedVariant.Inventory?.quantity || 0} in stock)
                  </span>
                )}
              </div>

              {/* Variants */}
              {!!product.variants?.length && (
                <div className="space-y-6">
                  {/* Color Selection */}
                  {product.variants.some((v) => v.color) && (
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">Choose Color</h3>
                      <TooltipProvider delayDuration={120}>
                        <div className="flex flex-wrap gap-3">
                          {unique((product.variants || []).map((v) => v.color as string)).map((color) => {
                            const available = isColorAvailable(product, color, selectedSize)
                            const swatch = getSwatchColor(color)
                            const isSelected = selectedColor === color
                            const stockCount = (product.variants || [])
                              .filter((v) => v.color === color && (selectedSize ? v.size === selectedSize : true))
                              .reduce((sum, v) => sum + (v.Inventory?.quantity || 0), 0)
                            
                            return (
                              <Tooltip key={color}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => available && handleSelectColor(color)}
                                    disabled={!available}
                                    className={`
                                      relative p-0 rounded-full border-3 h-12 w-12 transition-all duration-300 ease-in-out
                                      ${isSelected 
                                        ? 'ring-4 ring-orange-400 ring-offset-2 scale-110 shadow-lg' 
                                        : available
                                          ? 'hover:scale-105 hover:ring-2 hover:ring-orange-300 hover:shadow-md'
                                          : 'opacity-30 cursor-not-allowed'
                                      }
                                      ${available 
                                        ? 'cursor-pointer' 
                                        : 'cursor-not-allowed'
                                      }
                                      focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-offset-2
                                    `}
                                    aria-label={`${color} ${available ? 'available' : 'unavailable'}`}
                                  >
                                    <span 
                                      className="block h-10 w-10 rounded-full border-2 border-white shadow-sm transition-all duration-200" 
                                      style={{ backgroundColor: swatch }} 
                                    />
                                    {isSelected && (
                                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                                        <div className="h-2 w-2 bg-white rounded-full" />
                                      </div>
                                    )}
                                    {available && !isSelected && (
                                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200" />
                                    )}
                                    {!available && (
                                      <div className="absolute inset-0 bg-gray-400 rounded-full opacity-50" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-center">
                                    <p className="font-medium">{color}</p>
                                    <p className="text-xs text-gray-400">
                                      {available ? `${stockCount} in stock` : 'Out of stock'}
                                    </p>
                                    {selectedSize && available && (
                                      <p className="text-xs text-green-600 mt-1">
                                        ✓ Available in {selectedSize}
                                      </p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </div>
                      </TooltipProvider>
                      {selectedColor && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200 transition-all duration-300">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-orange-700">Selected:</span> {selectedColor}
                          </p>
                          {selectedSize && (
                            <p className="text-xs text-orange-600 mt-1">
                              Available sizes: {getAvailableSizes(product, selectedColor).join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.variants.some((v) => v.size) && (
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">Choose Size</h3>
                      <div className="flex flex-wrap gap-3">
                        {unique((product.variants || []).map((v) => v.size as string)).map((size) => {
                          const available = isSizeAvailable(product, size, selectedColor)
                          const isSelected = selectedSize === size
                          const stockCount = (product.variants || [])
                            .filter((v) => v.size === size && (selectedColor ? v.color === selectedColor : true))
                            .reduce((sum, v) => sum + (v.Inventory?.quantity || 0), 0)
                          
                          return (
                            <button
                              key={size}
                              onClick={() => available && handleSelectSize(size)}
                              disabled={!available}
                              className={`
                                relative px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-300 ease-in-out
                                ${isSelected 
                                  ? 'bg-orange-500 text-white border-orange-500 shadow-lg scale-105' 
                                  : available 
                                    ? 'bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 hover:scale-105 hover:shadow-md' 
                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                                }
                                focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-offset-2
                              `}
                              aria-label={`Size ${size} ${available ? 'available' : 'unavailable'}`}
                            >
                              {size}
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center animate-pulse">
                                  <div className="h-2 w-2 bg-orange-500 rounded-full" />
                                </div>
                              )}
                              {available && !isSelected && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 bg-white rounded-full" />
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      {selectedSize && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-300">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-700">Selected:</span> {selectedSize}
                          </p>
                          {selectedColor && (
                            <p className="text-xs text-blue-600 mt-1">
                              Available colors: {getAvailableColors(product, selectedSize).join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selection Summary */}
                  {selectedVariant && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl border border-orange-200 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">Your Selection</h4>
                        <Badge className="bg-orange-500 text-white animate-pulse">
                          {selectedVariant.Inventory?.quantity || 0} in stock
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600">Color:</span>
                          <span className="ml-2 font-medium text-gray-800">{selectedColor || 'N/A'}</span>
                          {selectedColor && (
                            <div 
                              className="ml-2 h-4 w-4 rounded-full border border-gray-300" 
                              style={{ backgroundColor: getSwatchColor(selectedColor) }}
                            />
                          )}
                        </div>
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <span className="ml-2 font-medium text-gray-800">{selectedSize || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">SKU:</span>
                          <span className="ml-2 font-medium text-gray-800">{selectedVariant.sku}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="ml-2 font-bold text-orange-600">${selectedVariant.price}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <p className="text-xs text-gray-500">
                          💡 Tip: Selecting a color automatically shows available sizes, and vice versa
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              {selectedVariant && (
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="rounded-r-none border-r-0"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(selectedVariant?.Inventory?.quantity || 10, q + 1)
                        )
                      }
                      disabled={quantity >= (selectedVariant?.Inventory?.quantity || 10)}
                      className="rounded-l-none border-l-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600"
                  disabled={!isInStock || !selectedVariant || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart
                    ? "Adding..."
                    : !isInStock
                    ? "Out of Stock"
                    : !selectedVariant
                    ? "Select Options"
                    : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 hover:border-orange-500 hover:text-orange-500 bg-transparent"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 hover:border-orange-500 hover:text-orange-500 bg-transparent"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="h-6 w-6 text-orange-500" />
                  <span className="text-xs font-medium">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="h-6 w-6 text-orange-500" />
                  <span className="text-xs font-medium">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="h-6 w-6 text-orange-500" />
                  <span className="text-xs font-medium">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="border-t p-6 lg:p-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                {product.careNotes && (
                  <div>
                    <h4 className="font-semibold mb-3">Care Instructions:</h4>
                    <p className="text-gray-700">{product.careNotes}</p>
                  </div>
                )}
                {product.ageMinMonths && product.ageMaxMonths && (
                  <div>
                    <h4 className="font-semibold mb-3">Age Range:</h4>
                    <p className="text-gray-700">
                      {product.ageMinMonths} - {product.ageMaxMonths} months
                    </p>
                  </div>
                )}
                {product.countryOfOrigin && (
                  <div>
                    <h4 className="font-semibold mb-3">Country of Origin:</h4>
                    <p className="text-gray-700">{product.countryOfOrigin}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-700">Product ID</span>
                    <span className="text-gray-600">{product.id}</span>
                  </div>
                  {product.brand && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">Brand</span>
                      <span className="text-gray-600">{product.brand}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">Category</span>
                      <span className="text-gray-600">{product.category.name}</span>
                    </div>
                  )}
                  {product.ageMinMonths && product.ageMaxMonths && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">Age Range</span>
                      <span className="text-gray-600">
                        {product.ageMinMonths} - {product.ageMaxMonths} months
                      </span>
                    </div>
                  )}
                  {product.countryOfOrigin && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">Country of Origin</span>
                      <span className="text-gray-600">{product.countryOfOrigin}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-700">Status</span>
                    <span className="text-gray-600">{product.active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <p className="text-gray-600">Customer reviews will be displayed here.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
