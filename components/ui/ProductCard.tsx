'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, ProductVariant } from '@/lib/api';
import { getImageUrl } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'minimal';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get the first variant as default
  const defaultVariant = product.variants?.[0];
  const minPrice = Math.min(...product.variants.map(v => Number(v.price)));
  const maxPrice = Math.max(...product.variants.map(v => Number(v.price)));
  const hasMultiplePrices = minPrice !== maxPrice;

  if (variant === 'minimal') {
    return (
      <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={getImageUrl(product.coverImageUrl)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.svg';
              }}
            />
          </div>
        </Link>
        
        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {hasMultiplePrices ? (
                <span className="text-primary font-semibold">
                  ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-primary font-semibold">
                  ${defaultVariant?.price ? Number(defaultVariant.price).toFixed(2) : '0.00'}
                </span>
              )}
            </div>
            <Link href={`/product/${product.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          <img
            src={getImageUrl(product.coverImageUrl)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.svg';
            }}
          />
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div>
            {hasMultiplePrices ? (
              <span className="text-primary font-semibold">
                ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
              </span>
            ) : (
              <span className="text-primary font-semibold">
                ${defaultVariant?.price ? Number(defaultVariant.price).toFixed(2) : '0.00'}
              </span>
            )}
          </div>
          
          {product.category?.name && (
            <Badge variant="secondary" className="text-xs">
              {product.category?.name}
            </Badge>
          )}
        </div>
        
        <Link href={`/product/${product.id}`}>
          <Button className="w-full">
            View Details & Order
          </Button>
        </Link>
      </div>
    </div>
  );
}
