'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { useDiscountCalculation } from '@/hooks/use-discounts';

interface CouponInputProps {
  cartItems: Array<{
    productId: string;
    variantId?: string;
    categoryId?: string;
    price: number;
    quantity: number;
  }>;
  customerId?: string;
}

export function CouponInput({ cartItems, customerId }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  
  const {
    discountCode,
    setDiscountCode,
    appliedDiscounts,
    totalDiscount,
    loading,
    error,
    validationError,
    applyDiscountCode,
    removeDiscountCode,
  } = useDiscountCalculation(cartItems, customerId);


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    try {
      await applyDiscountCode(couponCode.trim().toUpperCase());
      setCouponCode('');
    } catch (error) {
      console.error('Error applying coupon:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = (discountId: string) => {
    removeDiscountCode();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Discount Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coupon Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="coupon-code">Enter coupon code</Label>
            <Input
              id="coupon-code"
              placeholder="SUMMER2024"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isApplying || loading}
            />
          </div>
          <Button 
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || isApplying || loading}
            className="mt-6"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </Button>
        </div>

        {/* Error Messages */}
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Applied Discounts */}
        {appliedDiscounts.length > 0 && (
          <div className="space-y-2">
            <Label>Applied Discounts</Label>
            {appliedDiscounts.map((discount) => (
              <div 
                key={discount.id} 
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">{discount.name}</div>
                    <div className="text-sm text-green-600">
                      {discount.code ? `Code: ${discount.code}` : 'Auto-applied'}
                      {discount.type === 'PERCENT' && ` - ${discount.value}% off`}
                      {discount.type === 'FIXED' && ` - $${discount.value} off`}
                      {discount.type === 'BOGO' && ` - Buy ${discount.value} Get 1`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-800">
                    -${discount.amount.toFixed(2)}
                  </span>
                  {discount.code && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCoupon(discount.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Discount Summary */}
        {totalDiscount > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-medium text-blue-800">Total Discount</span>
            <span className="font-bold text-blue-800">
              -${totalDiscount.toFixed(2)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
