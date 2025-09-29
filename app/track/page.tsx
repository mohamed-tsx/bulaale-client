'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, AlertCircle } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { useErrorHandler } from '@/lib/contexts/error-handler-context';

export default function TrackOrderPage() {
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const [orderCode, setOrderCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderCode.trim()) {
      handleError(new Error('Please enter an order number'), 'Order number is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await orderApi.getByCode(orderCode.trim());
      if (response.data.success) {
        router.push(`/order/${orderCode.trim()}`);
      } else {
        handleError(new Error('Order not found'), 'Order not found. Please check your order number.');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      handleError(error, 'Order not found. Please check your order number.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-600">
          Enter your order number to check the status of your order
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <Label htmlFor="orderCode">Order Number</Label>
              <Input
                id="orderCode"
                type="text"
                placeholder="e.g., ORD-2025-000123"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="mt-1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You can find your order number in your confirmation email or receipt
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900">Can't find your order number?</h4>
            <p className="text-sm text-gray-600">
              Check your email for the order confirmation message. The order number starts with "ORD-".
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Still having trouble?</h4>
            <p className="text-sm text-gray-600">
              Contact our customer service team for assistance with your order.
            </p>
          </div>
          <div className="pt-3">
            <Button variant="outline" onClick={() => router.push('/contact')}>
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
