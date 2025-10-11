import { useState, useEffect, useMemo, useCallback } from 'react';
import { discountApi, type Discount, type DiscountPreview, type CartLine } from '@/lib/discount-api';

export function useDiscounts() {
  const [activeDiscounts, setActiveDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const discounts = await discountApi.getActive();
      setActiveDiscounts(discounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDiscounts();
  }, []);

  return {
    activeDiscounts,
    loading,
    error,
    refetch: fetchActiveDiscounts,
  };
}

export function useDiscountCalculation(cartItems: CartLine[], customerId?: string) {
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscounts, setAppliedDiscounts] = useState<DiscountPreview[]>([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Memoize cart items to prevent unnecessary recalculations
  const memoizedCartItems = useMemo(() => cartItems, [JSON.stringify(cartItems)]);
  
  // Automatically calculate discounts when cart items change
  useEffect(() => {
    calculateDiscounts();
  }, [memoizedCartItems, discountCode, customerId]);

  const calculateDiscounts = useCallback(async () => {
    if (memoizedCartItems.length === 0) {
      setAppliedDiscounts([]);
      setTotalDiscount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setValidationError(null);

      // Validate cart items before sending
      const validCartItems = memoizedCartItems.filter(item => 
        item.productId && 
        item.price > 0 && 
        item.quantity > 0
      );

      if (validCartItems.length === 0) {
        setAppliedDiscounts([]);
        setTotalDiscount(0);
        return;
      }

      const result = await discountApi.previewDiscounts(validCartItems, discountCode || undefined, customerId);
      
      // Ensure proper number formatting for money calculations
      const formattedDiscounts = result.appliedDiscounts.map(discount => ({
        ...discount,
        amount: Number(discount.amount.toFixed(2))
      }));
      
      setAppliedDiscounts(formattedDiscounts);
      setTotalDiscount(Number(result.totalDiscount.toFixed(2)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate discounts');
    } finally {
      setLoading(false);
    }
  }, [memoizedCartItems, discountCode, customerId]);

  const validateDiscountCode = async (code: string) => {
    try {
      setValidationError(null);
      const validation = await discountApi.validateCode(code, cartItems, customerId);
      
      if (!validation.valid) {
        setValidationError(validation.message);
        return false;
      }
      
      return true;
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Failed to validate code');
      return false;
    }
  };

  const applyDiscountCode = async (code: string) => {
    // Check if this discount code is already applied
    if (discountCode === code.toUpperCase()) {
      setValidationError('This discount code is already applied');
      return;
    }

    const isValid = await validateDiscountCode(code);
    if (isValid) {
      setDiscountCode(code);
      await calculateDiscounts();
    }
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setValidationError(null);
    calculateDiscounts();
  };

  return {
    discountCode,
    setDiscountCode,
    appliedDiscounts,
    totalDiscount,
    loading,
    error,
    validationError,
    applyDiscountCode,
    removeDiscountCode,
    calculateDiscounts,
  };
}

export function useProductDiscounts(productId: string, variantId?: string, categoryId?: string) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const activeDiscounts = await discountApi.getActive();
      
      
      // Filter discounts that apply to this product
      const applicableDiscounts = activeDiscounts.filter(discount => {
        if (discount.scope === 'CART') {
          return true;
        }
        
        if (discount.scope === 'ITEM') {
          // Check if discount targets this product
          const targetsProduct = discount.targetProducts?.some(tp => tp.productId === productId) || false;
          const targetsVariant = variantId && discount.targetVariants?.some(tv => tv.variantId === variantId) || false;
          const targetsCategory = categoryId && discount.targetCategories?.some(tc => tc.categoryId === categoryId) || false;
          
          // If no specific targeting is set, apply to all items
          const hasNoTargeting = (!discount.targetProducts || discount.targetProducts.length === 0) &&
                                (!discount.targetVariants || discount.targetVariants.length === 0) &&
                                (!discount.targetCategories || discount.targetCategories.length === 0);
          
          const isApplicable = targetsProduct || targetsVariant || targetsCategory || hasNoTargeting;
          
          // Debug logging (removed for performance)
          
          return isApplicable;
        }
        
        return false;
      });
      
      setDiscounts(applicableDiscounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product discounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDiscounts();
  }, [productId, variantId, categoryId]);

  return {
    discounts,
    loading,
    error,
    refetch: fetchProductDiscounts,
  };
}
