"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import VariantSelector from "@/components/VariantSelector";
import { useCartStore } from "@/lib/stores/cartStore";
import { api } from "@/lib/api";

interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  optionSummary?: string;
  price: number;
  active: boolean;
  images: any[];
  Inventory?: {
    quantity: number;
  };
}

interface Product {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  ageMinMonths?: number;
  ageMaxMonths?: number;
  careNotes?: string;
  countryOfOrigin?: string;
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
        setProduct(productData);
        
        // Auto-select first available variant
        const availableVariants = productData.variants.filter(
          variant => variant.active && variant.Inventory && variant.Inventory.quantity > 0
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

  const handleAddToCart = (variant: ProductVariant) => {
    if (!product) return;
    
    const cartItem = {
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      price: Number(variant.price || 0),
      quantity: 1,
      image: product.coverImageUrl,
      variant: {
        color: variant.color,
        size: variant.size,
        optionSummary: variant.optionSummary,
      },
    };
    
    addItem(cartItem);
    
    // Show success feedback
    const button = document.querySelector('[data-add-to-cart]');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Added!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getAgeRange = (minMonths?: number, maxMonths?: number) => {
    if (!minMonths && !maxMonths) return "All ages";
    if (!minMonths) return `Up to ${maxMonths} months`;
    if (!maxMonths) return `${minMonths}+ months`;
    return `${minMonths} - ${maxMonths} months`;
  };

  const getProductImages = () => {
    const images = [];
    if (product?.coverImageUrl) {
      images.push({
        url: product.coverImageUrl,
        isPrimary: true,
      });
    }
    if (product?.images) {
      images.push(...product.images);
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
    variant => variant.active && variant.Inventory && variant.Inventory.quantity > 0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold text-foreground">
                {product.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {useCartStore.getState().items.length}
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[selectedImageIndex]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-muted rounded-lg overflow-hidden ${
                      selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{product.category?.name}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">4.8 (127 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              {product.brand && (
                <p className="text-lg text-muted-foreground mb-4">
                  by {product.brand}
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {product.description && (
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Age Range:</span>
                  <p className="font-medium">{getAgeRange(product.ageMinMonths, product.ageMaxMonths)}</p>
                </div>
                {product.countryOfOrigin && (
                  <div>
                    <span className="text-muted-foreground">Origin:</span>
                    <p className="font-medium">{product.countryOfOrigin}</p>
                  </div>
                )}
              </div>

              {product.careNotes && (
                <div>
                  <h3 className="font-medium mb-2">Care Instructions</h3>
                  <p className="text-muted-foreground">{product.careNotes}</p>
                </div>
              )}
            </div>

            {/* Variant Selection */}
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantSelect={handleVariantSelect}
              onAddToCart={handleAddToCart}
            />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm">100% Safe</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <span className="text-sm">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
