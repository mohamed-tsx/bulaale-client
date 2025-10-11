'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { ProductDiscountBadge } from './ProductDiscountBadge';
import { getImageUrl } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  categoryId?: string;
  variants?: Array<{
    id: string;
    optionSummary: string;
  }>;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, variantId?: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false,
  className = '' 
}: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      // Use first variant if available, otherwise use product ID
      const variantId = product.variants && product.variants.length > 0 
        ? product.variants[0].id 
        : undefined;
      onAddToCart(product.id, variantId);
    }
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.svg';
            }}
          />
        </Link>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 z-10"
          >
            -{discountPercentage}%
          </Badge>
        )}

        {/* Dynamic Discount Badge */}
        <ProductDiscountBadge
          productId={product.id}
          variantId={product.variants?.[0]?.id}
          categoryId={product.categoryId}
          price={product.price}
          className="absolute top-2 right-2"
        />

        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
            onClick={() => onToggleFavorite(product.id)}
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {product.rating} ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && (
            <Button 
              onClick={handleAddToCart}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
