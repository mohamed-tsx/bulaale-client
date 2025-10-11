'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, MapPin, User, Phone, Mail, ExternalLink, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/stores/cart-store';
import { orderApi, paymentApi } from '@/lib/api';
import { Order } from '@/lib/api';
import { getImageUrl } from '@/lib/api';
import { useErrorHandler } from '@/lib/contexts/error-handler-context';
import { useOrdersStore } from '@/lib/stores';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useDiscountCalculation } from '@/hooks/use-discounts';

export default function CheckoutPage() {
  const router = useRouter();
  const { handleError, handleSuccess } = useErrorHandler();
  const { items, getSubtotal, getVATAmount, getVATRate, getGrandTotal, clearCart } = useCartStore();
  const { addOrder, setCurrentOrder } = useOrdersStore();
  const { user, isAuthenticated } = useAuthStore();

  // Memoized cart items conversion for discount calculation
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
      if (applicableDiscount.maxDiscount) {
        itemDiscountAmount = Math.min(itemDiscountAmount, applicableDiscount.maxDiscount);
      }
    } else if (applicableDiscount.type === 'FIXED') {
      itemDiscountAmount = Math.min(applicableDiscount.value, itemTotal);
    }

    return {
      ...applicableDiscount,
      itemDiscountAmount: Number(itemDiscountAmount.toFixed(2))
    };
  }, [appliedDiscounts]);

  // Calculate final total with discounts
  const getFinalTotal = useCallback(() => {
    return Math.max(0, getSubtotal() + getVATAmount() - totalDiscount);
  }, [getSubtotal, getVATAmount, totalDiscount]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Somalia',
    
    // Payment
    paymentMethod: 'EVC_PLUS',
    phoneNumber: '',
    
    // Order
    notes: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order
      const orderData = {
        userId: isAuthenticated && user ? user.id : null, // Include userId if user is authenticated
        items: items.map(item => ({
          productVariantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        notes: formData.notes,
        // Include applied discounts for tracking
        appliedDiscounts: appliedDiscounts || [],
      };

      const orderResponse = await orderApi.create(orderData);
      
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const order = orderResponse.data.data;

      // Create payment
      const paymentData = {
        orderId: order.id,
        method: formData.paymentMethod,
        amount: getFinalTotal(), // Use final total with discounts
        phone: formData.phoneNumber,
      };

      const paymentResponse = await paymentApi.create(paymentData);
      
      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.message || 'Failed to create payment');
      }

      const payment = paymentResponse.data.data; 

      // Add order to store
      addOrder(order);
      setCurrentOrder(order);
      
      const successMessage = isAuthenticated 
        ? 'Order placed successfully! You will receive a confirmation email shortly.'
        : `Order placed successfully! Your order number is ${order.orderCode}. You can track your order using this number.`;
      
      handleSuccess(successMessage);

      // Redirect directly to order tracking page BEFORE clearing cart
      router.replace(`/order/${order.orderCode}`);
      
      // Clear cart after redirect with a small delay
      setTimeout(() => {
        clearCart();
      }, 100);

    } catch (error) {
      console.error('Checkout error:', error);
      handleError(error, 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect to cart
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                    <User className="h-4 w-4" />
                    <span>Logged in as: {user.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
                    <User className="h-4 w-4" />
                    <span>Guest checkout - <Link href="/auth/login" className="underline">Login</Link> to save your order</span>
                    <span className="text-xs text-gray-500">• You can track your order using the order number</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Somalia">Somalia</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                        <SelectItem value="Djibouti">Djibouti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EVC_PLUS">EVC Plus</SelectItem>
                      <SelectItem value="ZAAD_SERVICE">Zaad Service</SelectItem>
                      <SelectItem value="SAHAL_SERVICE">Sahal Service</SelectItem>
                      <SelectItem value="CASH">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentMethod !== 'CASH' && (
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number for Payment *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+252 61 123 4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      required={formData.paymentMethod !== 'CASH'}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions for your order..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Order...' : `Place Order - $${getFinalTotal().toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              {/* Cart Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        {/* Discount Badge for this item */}
                        {getItemDiscount(item) && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {getItemDiscount(item)?.type === 'PERCENT' ? `${getItemDiscount(item)?.value}% OFF` : 'DISCOUNT'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      {getItemDiscount(item) ? (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 line-through">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              ${((Number(item.price) * item.quantity) - (getItemDiscount(item)?.itemDiscountAmount || 0)).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-green-600">
                            Save ${(getItemDiscount(item)?.itemDiscountAmount || 0).toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-primary">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getSubtotal().toFixed(2)}</span>
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
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Total Discount</span>
                    <span className="font-bold">-${totalDiscount.toFixed(2)}</span>
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
                <Separator />
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary">${getFinalTotal().toFixed(2)}</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    You save ${totalDiscount.toFixed(2)} on this order
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}