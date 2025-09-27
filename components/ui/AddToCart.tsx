'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/lib/stores/cart-store';
import { Product, ProductVariant } from '@/lib/api';

interface AddToCartProps {
  product: Product;
  className?: string;
}

export default function AddToCart({ product, className = '' }: AddToCartProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    try {
      // Add multiple items based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          productId: product.id,
          variantId: selectedVariant.id,
          name: product.name,
          price: Number(selectedVariant.price),
          image: product.coverImageUrl,
          variant: {
            size: selectedVariant.size,
            color: selectedVariant.color,
          },
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.Inventory?.quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (!product.variants || product.variants.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Button disabled className="w-full">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Out of Stock
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Variant Selection */}
      {product.variants.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Variant</label>
          <Select
            value={selectedVariant?.id || ''}
            onValueChange={(value) => {
              const variant = product.variants.find(v => v.id === value);
              setSelectedVariant(variant || null);
              setQuantity(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {[variant.size, variant.color].filter(Boolean).join(' - ')} - ${Number(variant.price).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Quantity</label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(quantity + 1)}
            disabled={quantity >= (selectedVariant?.Inventory?.quantity || 0)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {selectedVariant && (
          <p className="text-xs text-gray-500">
            {selectedVariant.Inventory?.quantity || 0} available
          </p>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={isAdding || !selectedVariant || (selectedVariant.Inventory?.quantity || 0) === 0}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </Button>

      {/* Stock Status */}
      {selectedVariant && (
        <div className="text-sm">
          {(selectedVariant.Inventory?.quantity || 0) > 0 ? (
            <span className="text-green-600">✓ In Stock</span>
          ) : (
            <span className="text-red-600">✗ Out of Stock</span>
          )}
        </div>
      )}
    </div>
  );
}
