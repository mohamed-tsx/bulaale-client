'use client';

import React from 'react';
import { useDiscounts } from '@/hooks/use-discounts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DiscountDebugger() {
  const { activeDiscounts, loading, error } = useDiscounts();

  if (loading) {
    return <div>Loading discounts...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Discount Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Total Active Discounts:</strong> {activeDiscounts.length}</p>
          {activeDiscounts.map((discount, index) => (
            <div key={index} className="border p-2 rounded">
              <p><strong>Name:</strong> {discount.name}</p>
              <p><strong>Type:</strong> {discount.type}</p>
              <p><strong>Value:</strong> {discount.value}</p>
              <p><strong>Scope:</strong> {discount.scope}</p>
              <p><strong>Code:</strong> {discount.code || 'No code (Automatic)'}</p>
              <p><strong>Active:</strong> {discount.isActive ? 'Yes' : 'No'}</p>
              <p><strong>Status:</strong> {discount.status}</p>
              {discount.targetProducts && discount.targetProducts.length > 0 && (
                <p><strong>Target Products:</strong> {discount.targetProducts.length}</p>
              )}
              {discount.targetCategories && discount.targetCategories.length > 0 && (
                <p><strong>Target Categories:</strong> {discount.targetCategories.length}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
