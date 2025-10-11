'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Percent, DollarSign, Gift, Tag } from 'lucide-react';
import { useProductDiscounts } from '@/hooks/use-discounts';

interface DiscountDisplayProps {
  productId: string;
  variantId?: string;
  categoryId?: string;
  price: number;
  className?: string;
}

export function DiscountDisplay({ 
  productId, 
  variantId, 
  categoryId, 
  price, 
  className 
}: DiscountDisplayProps) {
  const { discounts, loading, error } = useProductDiscounts(productId, variantId, categoryId);


  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (discounts.length === 0) {
    return null;
  }

  // Get the best discount for this product
  const bestDiscount = discounts.reduce((best, current) => {
    const currentAmount = calculateDiscountAmount(current, price);
    const bestAmount = calculateDiscountAmount(best, price);
    return currentAmount > bestAmount ? current : best;
  });


  const discountAmount = calculateDiscountAmount(bestDiscount, price);
  const finalPrice = price - discountAmount;
  

  // Test calculation for debugging (removed for performance)
  // if (bestDiscount.type === 'PERCENT' && bestDiscount.value === 90) { ... }

  if (discountAmount <= 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="destructive" className="flex items-center gap-1">
          {getDiscountIcon(bestDiscount.type)}
          {formatDiscountValue(bestDiscount)}
        </Badge>
        {bestDiscount.name && (
          <span className="text-sm text-muted-foreground">{bestDiscount.name}</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
        <span className="text-lg font-bold text-destructive">${finalPrice.toFixed(2)}</span>
        <span className="text-sm text-green-600">
          Save ${discountAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function calculateDiscountAmount(discount: any, price: number): number {
  if (!discount || !price || price <= 0) return 0;
  
  
  if (discount.type === 'PERCENT') {
    const amount = (price * discount.value) / 100;
    const finalAmount = discount.maxDiscount ? Math.min(amount, discount.maxDiscount) : amount;
    
    
    return finalAmount;
  } else if (discount.type === 'FIXED') {
    const amount = Math.min(discount.value, price);
    return amount;
  } else if (discount.type === 'BOGO') {
    // For BOGO, we'll show a simplified calculation
    // In a real implementation, this would be more complex
    const amount = discount.bogoDiscountValue || 0;
    return amount;
  }
  return 0;
}

function formatDiscountValue(discount: any): string {
  if (discount.type === 'PERCENT') {
    return `${discount.value}% OFF`;
  } else if (discount.type === 'FIXED') {
    return `$${discount.value} OFF`;
  } else if (discount.type === 'BOGO') {
    return `Buy ${discount.buyQuantity} Get ${discount.getQuantity}`;
  }
  return 'SALE';
}

function getDiscountIcon(type: string) {
  switch (type) {
    case 'PERCENT':
      return <Percent className="w-3 h-3" />;
    case 'FIXED':
      return <DollarSign className="w-3 h-3" />;
    case 'BOGO':
      return <Gift className="w-3 h-3" />;
    default:
      return <Tag className="w-3 h-3" />;
  }
}
