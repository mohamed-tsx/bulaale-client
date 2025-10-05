"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Package,
  Shield,
  Truck,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ChevronRight,
  Facebook,
  Twitter,
  Mail,
  Share2,
} from "lucide-react";
import VariantSelector from "@/components/VariantSelector";
import { useCartStore } from "@/lib/stores/cart-store";
import { api } from "@/lib/api";

interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  optionSummary?: string;
  price: string;
  active: boolean;
  images: any[];
}

interface Product {
  id: string;
  name: string;
  description?: string;
  ageMinMonths?: number;
  ageMaxMonths?: number;
  careNotes?: string;
  active: boolean;
  coverImageUrl?: string;
  category?: {
    id: string;
    name: string;
  };
  variants: ProductVariant[];
  images: any[];
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  success: boolean;
  product: Product;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { addItem } = useCartStore();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get<ProductResponse>(`/products/${productId}`);
      
      if (response.data.success) {
        const productData = response.data.product;
        console.log(productData);
        
        // Check if product is active
        if (!productData.active) {
          setError("This product is no longer available");
          return;
        }
        
        setProduct(productData);
        
        // Auto-select first available variant
        const availableVariants = productData.variants.filter(
          variant => variant.active
        );
        
        if (availableVariants.length > 0) {
          setSelectedVariant(availableVariants[0]);
        }
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.error || "Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    const cartItem = {
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: Number(selectedVariant.price || 0),
      quantity: quantity,
      image: product.coverImageUrl,
      variant: {
        color: selectedVariant.color,
        size: selectedVariant.size,
        optionSummary: selectedVariant.optionSummary,
      },
    };
    
    addItem(cartItem);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-image.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imagePath}`;
  };

  const getProductImages = () => {
    const images = [];
    
    // Add cover image first
    if (product?.coverImageUrl) {
      images.push({
        url: product.coverImageUrl,
        isPrimary: true,
      });
    }
    
    // Add product images
    if (product?.images && product.images.length > 0) {
      images.push(...product.images.map(img => ({
        url: img.url,
        isPrimary: img.isPrimary,
      })));
    }
    
    // Add variant images
    if (product?.variants) {
      product.variants.forEach(variant => {
        if (variant.images && variant.images.length > 0) {
          images.push(...variant.images.map(img => ({
            url: img.url,
            isPrimary: img.isPrimary,
          })));
        }
      });
    }
    
    return images;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = getProductImages();
  const availableVariants = product.variants.filter(
    variant => variant.active
  );

  // Get unique colors and sizes from variants
  const colors = [...new Set(availableVariants.map(v => v.color).filter(Boolean))];
  const sizes = [...new Set(availableVariants.map(v => v.size).filter(Boolean))];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/shop" className="hover:text-gray-900">Shop</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-gray-900">{product.category?.name || 'Category'}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={getImageUrl(images[selectedImageIndex]?.url)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-gray-900' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={getImageUrl(image.url)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Product Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.8 from 350 reviews</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {selectedVariant ? formatPrice(Number(selectedVariant.price)) : formatPrice(Number(availableVariants[0]?.price || 0))}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {selectedVariant ? formatPrice(Number(selectedVariant.price) * 1.1) : formatPrice(Number(availableVariants[0]?.price || 0) * 1.1)}
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Available Color</h3>
                  <div className="flex gap-2">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedVariant?.color === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ 
                          backgroundColor: color === 'red' ? '#DC2626' : 
                                         color === 'blue' ? '#2563EB' : 
                                         color === 'green' ? '#16A34A' : 
                                         color === 'yellow' ? '#EAB308' : 
                                         color === 'black' ? '#000000' : 
                                         color === 'white' ? '#FFFFFF' : 
                                         color === 'beige' ? '#F5F5DC' : '#808080' 
                        }}
                        onClick={() => {
                          const variant = availableVariants.find(v => v.color === color);
                          if (variant) handleVariantSelect(variant);
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Available Size</h3>
                  <div className="flex gap-2">
                    {sizes.map((size, index) => (
                      <Button
                        key={index}
                        variant={selectedVariant?.size === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const variant = availableVariants.find(v => v.size === size);
                          if (variant) handleVariantSelect(variant);
                        }}
                        className="min-w-[40px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  size="lg"
                >
                  BUY IT NOW
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                >
                  ADD TO CART
                </Button>
              </div>

              {/* Product Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>SKU:</strong> {selectedVariant?.sku || availableVariants[0]?.sku}</p>
                <p><strong>Age Range:</strong> {product.ageMinMonths && product.ageMaxMonths ? 
                  `${product.ageMinMonths}-${product.ageMaxMonths} months` : 'All ages'}</p>
                <p><strong>Tags:</strong> {product.category?.name}, Baby Care, Fashion</p>
              </div>

              {/* Share Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Share</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Sort Dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">Short by:</label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>

              {/* Overall Rating */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">4.8 out of 5</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">(107 Reviews)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Brands Section */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Our top brands 20% Off</h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gray-100 rounded p-2 text-center text-xs">Adidas</div>
                    <div className="bg-gray-100 rounded p-2 text-center text-xs">Nike</div>
                    <div className="bg-gray-100 rounded p-2 text-center text-xs">Puma</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View more
                  </Button>
                </CardContent>
              </Card>

              {/* Write Review Form */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Write a review</h3>
                  <div className="space-y-3">
                    <Input placeholder="Name" />
                    <Input placeholder="Email" type="email" />
                    <Textarea placeholder="Your review..." rows={3} />
                    <Button size="sm" className="w-full">Submit Review</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Products */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Related Products</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Related Product {i}</p>
                          <p className="text-sm text-gray-600">${(50 + i * 10).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Product Name:</strong> {product.name}</p>
                  <p><strong>Category:</strong> {product.category?.name}</p>
                  <p><strong>Age Range:</strong> {product.ageMinMonths && product.ageMaxMonths ? 
                    `${product.ageMinMonths}-${product.ageMaxMonths} months` : 'All ages'}</p>
                  <p><strong>Product ID:</strong> {product.id}</p>
                  {product.careNotes && (
                    <p><strong>Care Notes:</strong> {product.careNotes}</p>
                  )}
                  {product.description && (
                    <p><strong>Description:</strong> {product.description}</p>
                  )}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Available Variants:</h4>
                    <div className="space-y-2">
                      {product.variants.map((variant, index) => (
                        <div key={variant.id} className="bg-gray-50 rounded p-3">
                          <p><strong>SKU:</strong> {variant.sku}</p>
                          <p><strong>Color:</strong> {variant.color || 'N/A'}</p>
                          <p><strong>Size:</strong> {variant.size || 'N/A'}</p>
                          <p><strong>Price:</strong> {formatPrice(Number(variant.price))}</p>
                          <p><strong>Status:</strong> {variant.active ? 'Active' : 'Inactive'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Review List</h3>
                  <span className="text-sm text-gray-600">Showing 1-3 of 24 results</span>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">Alex Done</span>
                            <span className="text-sm text-gray-500">Yesterday</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-600 mb-2">Nice fashion jacket. It wear very sharply on the body.</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="hover:text-gray-700">Reply</button>
                            <div className="flex items-center gap-1">
                              <span>👍</span>
                              <span>44</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>👎</span>
                              <span>0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">Dansky</span>
                            <span className="text-sm text-gray-500">2 day ago</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-600 mb-2">Excellent fashion jacket.</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="hover:text-gray-700">Reply</button>
                            <div className="flex items-center gap-1">
                              <span>👍</span>
                              <span>30</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>👎</span>
                              <span>0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">Mikzo UI</span>
                            <span className="text-sm text-gray-500">4 day ago</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-600 mb-2">Good it suitable for body fit.</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="hover:text-gray-700">Reply</button>
                            <div className="flex items-center gap-1">
                              <span>👍</span>
                              <span>25</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>👎</span>
                              <span>0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="discussion" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Discussion</h3>
                <div className="space-y-3">
                  <Input placeholder="Name" />
                  <Input placeholder="Email" type="email" />
                  <Textarea placeholder="Your question or comment..." rows={4} />
                  <Button>Submit</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}