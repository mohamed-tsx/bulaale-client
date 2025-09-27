"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  AlertCircle,
  Loader2,
  Baby,
  Truck,
  Shield,
  Package
} from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import { waafiApi, orderApi, paymentApi, ApiResponse, Order, Payment } from "@/lib/api";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<"shipping" | "payment" | "processing" | "success">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"EVC_PLUS" | "ZAAD_SERVICE" | "SAHAL_SERVICE" | "CASH">("EVC_PLUS");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "failed">("pending");
  const [orderId, setOrderId] = useState<string>("");

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    setPaymentStatus("processing");

    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          productVariantId: item.variantId,
          qty: item.quantity,
        })),
        notes: `Shipping to: ${shippingInfo.name}, ${shippingInfo.address}, ${shippingInfo.city}`,
      };

      console.log('Creating order with data:', orderData);

      // Create order via API
      const orderResponse = await orderApi.create(orderData) as { data: ApiResponse<Order> };
      console.log('Order response:', orderResponse);
      
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }
      
      const createdOrder = orderResponse.data.data; // The actual order data is nested under data.data
      setOrderId(createdOrder.id);

      console.log('Created order:', createdOrder);

      // Create payment
      const paymentData = {
        orderId: createdOrder.id,
        method: paymentMethod,
        amount: getTotalPrice(),
        phone: phoneNumber,
      };

      console.log('Creating payment with data:', paymentData);

      // Create payment via API
      const paymentResponse = await paymentApi.create(paymentData) as { data: ApiResponse<Payment> };
      console.log('Payment response:', paymentResponse);
      
      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.message || 'Failed to create payment');
      }
      
      const createdPayment = paymentResponse.data.data; // The actual payment data is nested under data.data

      console.log('Processing payment with Waafi...');

      // Process payment with Waafi simulation
      const waafiResponse = await waafiApi.processPayment(createdPayment.id);
      console.log('Waafi response:', waafiResponse);

      // Simulate payment processing
      setTimeout(async () => {
        try {
          console.log('Simulating payment acceptance...');
          // Simulate user accepting the payment
          await waafiApi.acceptPayment(createdPayment.id);
          setPaymentStatus("success");
          setStep("success");
          clearCart();
        } catch (error) {
          console.error("Payment acceptance error:", error);
          setPaymentStatus("failed");
        }
      }, 3000);

    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      // Handle error properly with type checking
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Payment failed: ${errorMessage}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
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
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No items to checkout</h2>
              <p className="text-muted-foreground mb-8">
                Your cart is empty. Add some items before proceeding to checkout.
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
            <Link href="/cart">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === "shipping" ? "text-primary" : step === "payment" || step === "processing" || step === "success" ? "text-green-600" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-primary text-primary-foreground" : step === "payment" || step === "processing" || step === "success" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}>
                1
              </div>
              <span className="font-medium">Shipping</span>
            </div>
            <div className={`w-16 h-0.5 ${step === "payment" || step === "processing" || step === "success" ? "bg-green-600" : "bg-muted"}`}></div>
            <div className={`flex items-center space-x-2 ${step === "payment" ? "text-primary" : step === "processing" || step === "success" ? "text-green-600" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-primary text-primary-foreground" : step === "processing" || step === "success" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <div className={`w-16 h-0.5 ${step === "processing" || step === "success" ? "bg-green-600" : "bg-muted"}`}></div>
            <div className={`flex items-center space-x-2 ${step === "processing" ? "text-primary" : step === "success" ? "text-green-600" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "processing" ? "bg-primary text-primary-foreground" : step === "success" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}>
                3
              </div>
              <span className="font-medium">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>
                    Please provide your shipping details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name</label>
                        <Input
                          value={shippingInfo.name}
                          onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <Input
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Address</label>
                      <Input
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        placeholder="Enter your address"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <Input
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-brand hover:opacity-90">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Payment Methods */}
                    <div className="space-y-3">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "EVC_PLUS" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("EVC_PLUS")}
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">EVC Plus</h4>
                            <p className="text-sm text-muted-foreground">Pay with your EVC Plus account</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "ZAAD_SERVICE" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("ZAAD_SERVICE")}
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium">Zaad Service</h4>
                            <p className="text-sm text-muted-foreground">Pay with your Zaad account</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "SAHAL_SERVICE" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("SAHAL_SERVICE")}
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-medium">Sahal Service</h4>
                            <p className="text-sm text-muted-foreground">Pay with your Sahal account</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "CASH" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("CASH")}
                      >
                        <div className="flex items-center space-x-3">
                          <Banknote className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium">Cash on Delivery</h4>
                            <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone Number for Mobile Payments */}
                    {paymentMethod !== "CASH" && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-gradient-brand hover:opacity-90">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "processing" && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    {paymentStatus === "processing" ? (
                      <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    ) : paymentStatus === "success" ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <AlertCircle className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {paymentStatus === "processing" && "Processing Payment..."}
                    {paymentStatus === "success" && "Payment Successful!"}
                    {paymentStatus === "failed" && "Payment Failed"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {paymentStatus === "processing" && "Please wait while we process your payment"}
                    {paymentStatus === "success" && "Your order has been placed successfully"}
                    {paymentStatus === "failed" && "There was an issue processing your payment"}
                  </p>
                  {paymentStatus === "processing" && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Simulating Waafi payment gateway... Please accept the payment on your phone.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === "success" && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Order Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for your purchase. Your order #{orderId} has been confirmed.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">What's Next?</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>• We'll prepare your order for shipping</li>
                        <li>• You'll get tracking information once shipped</li>
                        <li>• Expected delivery: 2-3 business days</li>
                      </ul>
                    </div>
                    <div className="flex space-x-4">
                      <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-gradient-brand hover:opacity-90">
                        Track Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-sm">${(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
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
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-brand-blue">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free shipping on all orders</span>
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
