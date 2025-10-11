"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  ArrowRight
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import Link from "next/link";
import { useDiscountCalculation } from "@/hooks/use-discounts";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getSubtotal, getVATAmount, getVATRate, getGrandTotal, getTotalItems, clearCart } = useCartStore();
  
  // Memoized cart items conversion
  const cartItems = useMemo(() => items.map(item => ({
    productId: item.productId,
    variantId: item.variantId,
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

  const getFinalTotal = () => {
    return Math.max(0, getSubtotal() + getVATAmount() - totalDiscount);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            {getTotalItems() > 0 && (
              <Badge className="bg-blue-600 text-white">
                {getTotalItems()}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some products to get started</p>
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.svg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          {/* Discount Badge for this item */}
                          {getItemDiscount(item) && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              {getItemDiscount(item)?.type === 'PERCENT' ? `${getItemDiscount(item)?.value}% OFF` : 'DISCOUNT'}
                            </Badge>
                          )}
                        </div>
                        {item.variant && (
                          <p className="text-xs text-gray-600 mb-2">
                            {item.variant.color && `${item.variant.color}`}
                            {item.variant.size && ` • ${item.variant.size}`}
                          </p>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getItemDiscount(item) ? (
                              <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500 line-through">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                  <span className="text-sm font-bold text-green-600">
                                    ${((item.price - (getItemDiscount(item)?.itemDiscountAmount || 0) / item.quantity) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                                <div className="text-xs text-green-600">
                                  Save ${(getItemDiscount(item)?.itemDiscountAmount || 0).toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-blue-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white">
            {/* Discount Alert */}
            {totalDiscount > 0 && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">%</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-green-800">
                        🎉 Great Savings!
                      </div>
                      <div className="text-xs text-green-700">
                        You're saving {((totalDiscount / getSubtotal()) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-800">
                      -${totalDiscount.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600">
                      Total savings
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium">${getSubtotal().toFixed(2)}</span>
              </div>
              
              {/* Applied Discounts */}
              {appliedDiscounts && appliedDiscounts.length > 0 && (
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-xs font-medium text-gray-700 mb-1">Applied Discounts:</div>
                  {appliedDiscounts.map((discount, index) => (
                    <div key={index} className="flex justify-between text-xs">
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

              {totalDiscount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span className="text-sm font-medium">Total Discount:</span>
                  <span className="text-sm font-bold">-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">VAT ({(getVATRate() * 100).toFixed(0)}%):</span>
                <span className="text-sm font-medium">${getVATAmount().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${getFinalTotal().toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full text-gray-600 hover:text-gray-800"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
