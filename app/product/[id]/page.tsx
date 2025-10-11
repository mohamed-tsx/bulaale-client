"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Heart, Share2, Truck, Shield, RotateCcw, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Product, getImageUrl, productApi } from "@/lib/api"
import { useCartStore } from "@/lib/stores/cart-store"
import { DiscountDisplay } from "@/components/DiscountDisplay"

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
          const productData = response.data.product
          
          // Check if product is active
          if (!productData.active) {
            setError("This product is no longer available")
            return
          }
          
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
                <Image 
                  src={heroImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                  priority 
                />
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {!isInStock && (
                    <Badge variant="destructive">
                      Out of Stock
                    </Badge>
                  )}
                  {product.category && (
                    <Badge variant="secondary">
                      {product.category.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(0, 8).map((image, index) => {
                  const isActive = image === heroImage
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImageUrl(image)}
                      className={[
                        "relative aspect-square rounded-md overflow-hidden border-2 transition-colors",
                        isActive
                          ? "border-primary"
                          : "border-border hover:border-primary/50",
                      ].join(" ")}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image 
                        src={image} 
                        alt={`${product.name} ${index + 1}`} 
                        fill 
                        className="object-cover" 
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 text-yellow-400 fill-current">
                      <svg viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    </div>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                </div>
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {product.name}
              </h1>
              
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-foreground">
                  ${currentPrice}
                </span>
                {selectedVariant?.Inventory && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-muted-foreground">
                      {selectedVariant.Inventory?.quantity || 0} in stock
                    </span>
                  </div>
                )}
              </div>
              
              {/* Discount Display */}
              {selectedVariant && (
                <DiscountDisplay
                  productId={product.id}
                  variantId={selectedVariant.id}
                  categoryId={product.categoryId}
                  price={Number(selectedVariant.price)}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>

            {/* Variants */}
            {!!product.variants?.length && (
              <div className="space-y-6">
                {/* Color Selection */}
                {product.variants.some((v) => v.color) && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
                    <TooltipProvider delayDuration={120}>
                      <div className="flex flex-wrap gap-2">
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
                                    relative p-0 rounded-full border-2 h-8 w-8 transition-colors
                                    ${isSelected 
                                      ? 'border-primary ring-2 ring-primary/20' 
                                      : available
                                        ? 'border-border hover:border-primary/50'
                                        : 'opacity-30 cursor-not-allowed'
                                    }
                                    ${available 
                                      ? 'cursor-pointer' 
                                      : 'cursor-not-allowed'
                                    }
                                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                  `}
                                  aria-label={`${color} ${available ? 'available' : 'unavailable'}`}
                                >
                                  <span 
                                    className="block h-6 w-6 rounded-full border border-background" 
                                    style={{ backgroundColor: swatch }} 
                                  />
                                  {isSelected && (
                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full flex items-center justify-center">
                                      <svg className="w-2 h-2 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-center">
                                  <p className="font-medium">{color}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {available ? `${stockCount} in stock` : 'Out of stock'}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </TooltipProvider>
                    
                    {selectedColor && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: getSwatchColor(selectedColor) }} />
                        <span className="text-sm text-muted-foreground">
                          Selected: {selectedColor}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Size Selection */}
                {product.variants.some((v) => v.size) && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
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
                              relative px-3 py-2 rounded-md border text-sm font-medium transition-colors
                              ${isSelected 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : available 
                                  ? 'bg-background text-foreground border-border hover:border-primary hover:bg-primary/5' 
                                  : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50'
                              }
                              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                            `}
                            aria-label={`Size ${size} ${available ? 'available' : 'unavailable'}`}
                          >
                            {size}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary-foreground rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    
                    {selectedSize && (
                      <div className="mt-3">
                        <span className="text-sm text-muted-foreground">
                          Selected: {selectedSize}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Selection Summary */}
                {selectedVariant && (
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-foreground">Selected</h4>
                      <Badge variant="secondary">
                        {selectedVariant.Inventory?.quantity || 0} in stock
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Color:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{selectedColor || 'N/A'}</span>
                          {selectedColor && (
                            <div 
                              className="h-3 w-3 rounded-full border border-border" 
                              style={{ backgroundColor: getSwatchColor(selectedColor) }}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium ml-1">{selectedSize || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-mono text-xs ml-1">{selectedVariant.sku}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold ml-1">${selectedVariant.price}</span>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              )}

            {/* Quantity & Actions */}
            {selectedVariant && (
              <div className="space-y-4">
                {/* Quantity */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Quantity</h3>
                  <div className="flex items-center border rounded-md w-fit">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="h-8 w-8 rounded-r-none"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </Button>
                    <span className="px-3 py-1 min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(selectedVariant?.Inventory?.quantity || 10, q + 1)
                        )
                      }
                      disabled={quantity >= (selectedVariant?.Inventory?.quantity || 10)}
                      className="h-8 w-8 rounded-l-none"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    disabled={!isInStock || !selectedVariant || isAddingToCart}
                    onClick={handleAddToCart}
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : !isInStock ? (
                      "Out of Stock"
                    ) : !selectedVariant ? (
                      "Select Options"
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </div>
                    )}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      aria-label="Add to Wishlist"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      aria-label="Share Product"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Why Choose Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">100% safe & encrypted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.careNotes && (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="text-sm font-medium text-foreground mb-2">Care Instructions</h4>
                    <p className="text-sm text-muted-foreground">{product.careNotes}</p>
                  </div>
                )}
                
                {product.ageMinMonths && product.ageMaxMonths && (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="text-sm font-medium text-foreground mb-2">Age Range</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.ageMinMonths} - {product.ageMaxMonths} months
                    </p>
                  </div>
                )}
                
                {product.careNotes && (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="text-sm font-medium text-foreground mb-2">Care Notes</h4>
                    <p className="text-sm text-muted-foreground">{product.careNotes}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-sm font-medium text-foreground">Product ID</span>
                  <span className="text-sm text-muted-foreground font-mono">{product.id}</span>
                </div>
                {product.category && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-sm font-medium text-foreground">Category</span>
                    <span className="text-sm text-muted-foreground">{product.category.name}</span>
                  </div>
                )}
                {product.ageMinMonths && product.ageMaxMonths && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-sm font-medium text-foreground">Age Range</span>
                    <span className="text-sm text-muted-foreground">
                      {product.ageMinMonths} - {product.ageMaxMonths} months
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-foreground">Status</span>
                  <Badge variant={product.active ? "default" : "destructive"}>
                    {product.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Customer Reviews</h3>
                <p className="text-sm text-muted-foreground">Customer reviews will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
