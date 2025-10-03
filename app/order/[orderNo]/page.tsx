'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { orderApi, Order, getImageUrl } from '@/lib/api';
import OrderStatusTimeline from '@/components/ui/OrderStatusTimeline';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  SHIPPED: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderNo = params.orderNo as string;
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousPaymentStatuses, setPreviousPaymentStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (orderNo) {
      fetchOrder();
    }
  }, [orderNo]);

  // Poll payment status if order has pending payments
  useEffect(() => {
    if (!order || !order.payments.length) return;

    const hasPendingPayment = order.payments.some(payment => 
      payment.status === 'PENDING' || payment.status === 'INITIATED'
    );

    if (!hasPendingPayment) return;

    const pollInterval = setInterval(() => {
      fetchOrder(); // Refresh order data to get updated payment status
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [order]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getByCode(orderNo);
      if (response.data.success) {  
        const newOrder = response.data.data;
        
        // Check for payment status changes
        if (order && newOrder.payments) {
          newOrder.payments.forEach((payment) => {
            const previousStatus = previousPaymentStatuses[payment.id];
            if (previousStatus && previousStatus !== payment.status) {
              // Payment status changed
              toast({
                title: "Payment Status Updated",
                description: `Payment ${payment.method} status changed from ${previousStatus} to ${payment.status}`,
                variant: payment.status === 'COMPLETED' ? 'default' : 'destructive'
              });
            }
          });
          
          // Update previous statuses
          const newStatuses: Record<string, string> = {};
          newOrder.payments.forEach((payment) => {
            newStatuses[payment.id] = payment.status;
          });
          setPreviousPaymentStatuses(newStatuses);
        }
        
        setOrder(newOrder);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <div className="mt-2">
            <p className="text-lg font-mono text-gray-800">#{order.orderCode}</p>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <Badge className={statusConfig[order.status].color}>
            {statusConfig[order.status].label}
          </Badge>
        </div>
      </div>

      {/* Guest Order Tracking Info */}
      {!order.user && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Track Your Order
                </h3>
                <p className="text-blue-800 mb-3">
                  You can track your order status using the order number below. Bookmark this page or save the order number for easy access.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="text-xl font-bold text-gray-900">{order.orderCode}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(order.orderCode)}
                    >
                      Copy Order Number
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusTimeline order={order} />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.productVariant.product.coverImageUrl)}
                        alt={item.productVariant.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {item.productVariant.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.productVariant.size && `Size: ${item.productVariant.size}`}
                        {item.productVariant.color && ` • Color: ${item.productVariant.color}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        SKU: {item.productVariant.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${Number(item.unitPrice).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.qty}
                      </p>
                      <p className="font-medium text-primary">
                        ${(Number(item.unitPrice) * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          {order.shippingAddressId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">
                  <p>Address information will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Note: Shipping address details are managed by the backend
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (5%)</span>
                <span className="font-medium">${Number(order.vatAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${Number(order.shippingFee).toFixed(2)}</span>
              </div>
              {Number(order.discountTotal) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-${Number(order.discountTotal).toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-primary">${Number(order.grandTotal).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {order.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Method</span>
                      <span className="text-sm font-medium">{payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-sm font-medium">${Number(payment.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                            payment.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {payment.status}
                        </Badge>
                        {(payment.status === 'PENDING' || payment.status === 'INITIATED') && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Payment status is being updated automatically" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date</span>
                      <span className="text-sm font-medium">
                        {new Date(payment.initiatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              {order.status === 'DELIVERED' && (
                <Button variant="outline" className="w-full">
                  Leave Review
                </Button>
              )}
              {order.status === 'PENDING' && (
                <Button variant="outline" className="w-full">
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
