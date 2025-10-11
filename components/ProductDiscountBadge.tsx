'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Percent, DollarSign, Gift, Tag } from 'lucide-react';
import { useProductDiscounts } from '@/hooks/use-discounts';

interface ProductDiscountBadgeProps {
  productId: string;
  variantId?: string;
  categoryId?: string;
  price: number;
  className?: string;
}

export function ProductDiscountBadge({ 
  productId, 
  variantId, 
  categoryId, 
  price, 
  className 
}: ProductDiscountBadgeProps) {
  const { discounts, loading, error } = useProductDiscounts(productId, variantId, categoryId);

  if (loading) {
    return (
      <Badge 
        variant="secondary" 
        className={`absolute top-2 right-2 z-10 ${className}`}
      >
        Loading...
      </Badge>
    );
  }

  if (error || discounts.length === 0) {
    return null;
  }

  // Get the best discount for this product
  const bestDiscount = discounts.reduce((best, current) => {
    const currentAmount = calculateDiscountAmount(current, price);
    const bestAmount = calculateDiscountAmount(best, price);
    return currentAmount > bestAmount ? current : best;
  });

  const discountAmount = calculateDiscountAmount(bestDiscount, price);

  if (discountAmount <= 0) {
    return null;
  }

  // Calculate display values
  const discountPercentage = Math.round((discountAmount / price) * 100);
  const discountText = getDiscountText(bestDiscount, discountAmount);

  return (
    <Badge 
      variant="destructive" 
      className={`absolute top-2 right-2 z-10 flex items-center gap-1 ${className}`}
    >
      {getDiscountIcon(bestDiscount.type)}
      {discountText}
    </Badge>
  );
}

function calculateDiscountAmount(discount: any, price: number): number {
  if (!discount || !price || price <= 0) return 0;
  
  if (discount.type === 'PERCENT') {
    const amount = (price * discount.value) / 100;
    return discount.maxDiscount ? Math.min(amount, discount.maxDiscount) : amount;
  } else if (discount.type === 'FIXED') {
    return Math.min(discount.value, price);
  } else if (discount.type === 'BOGO') {
    return discount.bogoDiscountValue || 0;
  }
  return 0;
}

function getDiscountText(discount: any, discountAmount: number): string {
  if (discount.type === 'PERCENT') {
    const percentage = Math.round((discountAmount / (discountAmount / (discount.value / 100))) * 100);
    return `-${discount.value}%`;
  } else if (discount.type === 'FIXED') {
    return `-$${discount.value}`;
  } else if (discount.type === 'BOGO') {
    return `BOGO`;
  }
  return `-${Math.round((discountAmount / (discountAmount / (discount.value / 100))) * 100)}%`;
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
