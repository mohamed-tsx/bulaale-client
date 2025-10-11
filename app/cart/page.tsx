'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/stores/cart-store';
import { getImageUrl } from '@/lib/api';
import { CouponInput } from '@/components/CouponInput';
import { useDiscountCalculation } from '@/hooks/use-discounts';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getVATAmount, getVATRate, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Memoized cart items conversion
  const cartItems = useMemo(() => items.map(item => ({
    productId: item.productId,
    variantId: item.variantId, // Can be undefined
    categoryId: item.categoryId,
    price: Number(item.price),
    quantity: item.quantity,
  })), [items]);

  const {
    appliedDiscounts,
    totalDiscount,
    loading: discountLoading,
    error: discountError,
  } = useDiscountCalculation(cartItems);

  // Memoized helper function to check if an item has discounts and calculate per-item discount
  const getItemDiscount = useCallback((item: any) => {
    if (!appliedDiscounts || appliedDiscounts.length === 0) return null;
    
    const applicableDiscount = appliedDiscounts.find(discount => 
      discount.targetProducts?.some(tp => tp.productId === item.productId) ||
      discount.targetVariants?.some(tv => tv.variantId === item.variantId) ||
      discount.targetCategories?.some(tc => tc.categoryId === item.categoryId) ||
      (!discount.targetProducts?.length && !discount.targetVariants?.length && !discount.targetCategories?.length)
    );

    if (!applicableDiscount) return null;

    // Calculate per-item discount amount
    const itemTotal = item.price * item.quantity;
    let itemDiscountAmount = 0;

    if (applicableDiscount.type === 'PERCENT') {
      itemDiscountAmount = (itemTotal * applicableDiscount.value) / 100;
      // maxDiscount property is not present on DiscountPreview, so skip this check
    } else if (applicableDiscount.type === 'FIXED') {
      itemDiscountAmount = Math.min(applicableDiscount.value, itemTotal);
    }

    return {
      ...applicableDiscount,
      itemDiscountAmount: Number(itemDiscountAmount.toFixed(2))
    };
  }, [appliedDiscounts]);

  // Calculate final total with VAT and discounts
  const getFinalTotal = useCallback(() => {
    return Math.max(0, getSubtotal() + getVATAmount() - totalDiscount);
  }, [getSubtotal, getVATAmount, totalDiscount]);

  // Debug logging (removed for performance)
  // console.log('Cart Page Debug:', { ... });

  const handleCheckout = () => {
    setIsCheckingOut(true);
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-gray-400 mb-6">
            <ShoppingBag className="mx-auto h-16 w-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      {/* Discount Alert */}
      {totalDiscount > 0 && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">%</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  🎉 Great Savings!
                </h3>
                <p className="text-sm text-green-700">
                  You're saving {((totalDiscount / getSubtotal()) * 100).toFixed(1)}% on your order
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">
                -${totalDiscount.toFixed(2)}
              </div>
              <div className="text-sm text-green-600">
                Total savings
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Coupon Input */}
          <CouponInput 
            cartItems={cartItems}
          />
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.svg';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    {/* Discount Badge for this item */}
                    {getItemDiscount(item) && (
                      <Badge variant="destructive" className="ml-2">
                        {getItemDiscount(item)?.type === 'PERCENT' ? `${getItemDiscount(item)?.value}% OFF` : 'DISCOUNT'}
                      </Badge>
                    )}
                  </div>
                  {item.variant && (
                    <p className="text-sm text-gray-500 mb-2">
                      {Object.values(item.variant).filter(Boolean).join(', ')}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {getItemDiscount(item) ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500 line-through">
                          ${Number(item.price).toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          ${(Number(item.price) - (getItemDiscount(item)?.itemDiscountAmount || 0) / item.quantity).toFixed(2)}
                        </span>
                        <span className="text-xs text-green-600">
                          (Save ${getItemDiscount(item)?.itemDiscountAmount?.toFixed(2) || 0})
                        </span>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-primary">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <div className="text-center pt-4">
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-gray-500 hover:text-red-500"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Discount Summary */}
            {discountLoading && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-600">Calculating discounts...</div>
              </div>
            )}
            
            {discountError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-600">Error: {discountError}</div>
              </div>
            )}

            {/* Auto Applied Discounts */}
            {appliedDiscounts && appliedDiscounts.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Applied Discounts</h3>
                <div className="space-y-2">
                  {appliedDiscounts.map((discount, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">
                          {discount.name}
                          {discount.code && ` (${discount.code})`}
                        </span>
                      </div>
                      <span className="font-medium text-green-800">
                        -${discount.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getSubtotal().toFixed(2)}</span>
              </div>
              
              {/* Discount Breakdown */}
              {appliedDiscounts && appliedDiscounts.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Discount Breakdown:</div>
                  {appliedDiscounts.map((discount, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {discount.name}
                        {discount.type === 'PERCENT' && ` (${discount.value}% off)`}
                        {discount.type === 'FIXED' && ` ($${discount.value} off)`}
                      </span>
                      <span className="text-green-600 font-medium">
                        -${discount.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total Discount Display */}
              {totalDiscount > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Total Discount</span>
                    <span className="font-medium">-${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-green-600">
                    You save ${totalDiscount.toFixed(2)} on this order
                  </div>
                  {/* Prominent Savings Display */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-800">
                          You're saving {((totalDiscount / getSubtotal()) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 line-through">
                          ${getSubtotal().toFixed(2)}
                        </div>
                        <div className="text-lg font-bold text-green-700">
                          ${Math.max(0, getSubtotal() - totalDiscount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT ({(getVATRate() * 100).toFixed(0)}%)</span>
                <span className="font-medium">${getVATAmount().toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${getFinalTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mb-4"
              size="lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Secure checkout</p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span>✓ SSL Encrypted</span>
                <span>✓ Safe Payment</span>
                <span>✓ Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}