'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Percent, DollarSign, Gift, Tag, ArrowRight } from 'lucide-react';
import { useDiscounts } from '@/hooks/use-discounts';
import Link from 'next/link';

export function DiscountBanner() {
  const { activeDiscounts, loading, error } = useDiscounts();

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || activeDiscounts.length === 0) {
    return null;
  }

  // Get the most prominent discount (highest value or most recent)
  const featuredDiscount = activeDiscounts.reduce((best, current) => {
    if (current.scope === 'CART' && current.type === 'PERCENT') {
      return current.value > best.value ? current : best;
    }
    return best;
  }, activeDiscounts[0]);

  if (!featuredDiscount) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {getDiscountIcon(featuredDiscount.type)}
                {formatDiscountValue(featuredDiscount)}
              </Badge>
              <span className="text-sm opacity-90">Limited Time</span>
            </div>
            
            <h3 className="text-xl font-bold mb-1">
              {featuredDiscount.name}
            </h3>
            
            {featuredDiscount.description && (
              <p className="text-sm opacity-90 mb-3">
                {featuredDiscount.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              {featuredDiscount.code && (
                <div className="flex items-center gap-2">
                  <span className="opacity-75">Code:</span>
                  <code className="bg-white/20 px-2 py-1 rounded text-xs font-mono">
                    {featuredDiscount.code}
                  </code>
                </div>
              )}
              
              {featuredDiscount.endsAt && (
                <div className="flex items-center gap-2">
                  <span className="opacity-75">Expires:</span>
                  <span className="font-medium">
                    {new Date(featuredDiscount.endsAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-6">
            <Link href="/products">
              <Button 
                variant="secondary" 
                className="bg-white text-red-600 hover:bg-white/90"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
