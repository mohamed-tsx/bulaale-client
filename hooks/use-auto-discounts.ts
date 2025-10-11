import { useState, useEffect } from 'react';
import { discountApi, type CartLine } from '@/lib/discount-api';

export function useAutoDiscounts(cartItems: CartLine[], customerId?: string) {
  const [autoDiscounts, setAutoDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAutoDiscounts = async () => {
    if (cartItems.length === 0) {
      setAutoDiscounts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get active discounts
      const activeDiscounts = await discountApi.getActive();
      
      // Filter for auto-apply discounts (no coupon code required)
      const autoApplyDiscounts = activeDiscounts.filter(discount => 
        !discount.code && discount.isActive && discount.status === 'ACTIVE'
      );

      // Calculate which discounts apply to current cart
      const applicableDiscounts = [];
      
      for (const discount of autoApplyDiscounts) {
        try {
          // Calculate discount amount for this discount
          const result = await discountApi.previewDiscounts(cartItems, undefined, customerId);
          
          // Find this specific discount in the results
          const appliedDiscount = result.appliedDiscounts.find(d => d.id === discount.id);
          if (appliedDiscount && appliedDiscount.amount > 0) {
            applicableDiscounts.push({
              ...discount,
              calculatedAmount: appliedDiscount.amount
            });
          }
        } catch (discountError) {
          console.warn(`Error calculating discount ${discount.id}:`, discountError);
          // Continue with other discounts
        }
      }

      setAutoDiscounts(applicableDiscounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auto discounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutoDiscounts();
  }, [cartItems, customerId]);

  return {
    autoDiscounts,
    loading,
    error,
    refetch: fetchAutoDiscounts,
  };
}
