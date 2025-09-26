"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Baby
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-brand p-2 rounded-lg shadow-sm">
                  <Baby className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-brand-blue">Bulaale</h1>
                  <p className="text-sm text-brand-pink font-medium">Baby Care</p>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/">
                <Button className="bg-gradient-brand hover:opacity-90">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-brand p-2 rounded-lg shadow-sm">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-blue">Bulaale</h1>
                <p className="text-sm text-brand-pink font-medium">Baby Care</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {item.variant.color && (
                          <Badge variant="outline" className="text-xs">
                            {item.variant.color}
                          </Badge>
                        )}
                        {item.variant.size && (
                          <Badge variant="outline" className="text-xs">
                            {item.variant.size}
                          </Badge>
                        )}
                        {item.variant.optionSummary && (
                          <Badge variant="outline" className="text-xs">
                            {item.variant.optionSummary}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${Number(item.price || 0).toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price and Actions */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-brand-blue mb-2">
                        ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your items and proceed to checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-brand-blue">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full">
                  <Button
                    className="w-full bg-gradient-brand hover:opacity-90 h-12 text-lg"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Baby className="h-4 w-4 text-pink-600" />
                    <span>100% safe for babies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
