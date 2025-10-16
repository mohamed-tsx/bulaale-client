// Discount types
export interface Discount {
  id: string;
  name: string;
  description?: string;
  type: 'PERCENT' | 'FIXED' | 'BOGO';
  scope: 'CART' | 'ITEM';
  value: number;
  maxDiscount?: number;
  code?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'SCHEDULED';
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit?: number;
  minOrderAmount?: number;
  minItems?: number;
  buyQuantity?: number;
  getQuantity?: number;
  bogoDiscountType?: 'PERCENT' | 'FIXED';
  bogoDiscountValue?: number;
  excludeOnSale: boolean;
  isStackable: boolean;
  targetProducts?: Array<{ 
    id: string;
    productId: string;
    product: { 
      id: string;
      name: string; 
    } 
  }>;
  targetVariants?: Array<{ 
    id: string;
    variantId: string;
    variant: { 
      id: string;
      optionSummary: string; 
    } 
  }>;
  targetCategories?: Array<{ 
    id: string;
    categoryId: string;
    category: { 
      id: string;
      name: string; 
    } 
  }>;
  createdAt: string;
}

export interface DiscountPreview {
  id: string;
  name: string;
  type: 'PERCENT' | 'FIXED' | 'BOGO';
  value: number;
  amount: number;
  maxDiscount?: number;
  code?: string;
  targetProducts?: Array<{ 
    id: string;
    productId: string;
    product: { 
      id: string;
      name: string; 
    } 
  }>;
  targetVariants?: Array<{ 
    id: string;
    variantId: string;
    variant: { 
      id: string;
      optionSummary: string; 
    } 
  }>;
  targetCategories?: Array<{ 
    id: string;
    categoryId: string;
    category: { 
      id: string;
      name: string; 
    } 
  }>;
}

export interface CartLine {
  productId: string;
  variantId?: string;
  categoryId?: string;
  price: number;
  quantity: number;
}

import { api } from './api';

// Discount API functions
export const discountApi = {
  // Get active discounts
  async getActive(): Promise<Discount[]> {
    const response = await api.get('/discounts/active');
    return response.data.data;
  },

  // Validate discount code
  async validateCode(code: string, cartItems: CartLine[], customerId?: string): Promise<{
    valid: boolean;
    message: string;
    discount?: Discount;
  }> {
    // Transform cart items to match backend expectations
    const transformedCartItems = cartItems.map(item => ({
      productVariantId: item.variantId || item.productId, // Use variantId if available, fallback to productId
      productId: item.productId,
      categoryId: item.categoryId,
      price: item.price,
      quantity: item.quantity,
    }));

    const response = await api.post(`/discounts/validate/${code}`, {
      cartItems: transformedCartItems,
      customerId,
    });
    return response.data.data;
  },

  // Calculate discount for cart
  async previewDiscounts(cartItems: CartLine[], discountCode?: string, customerId?: string): Promise<{
    totalDiscount: number;
    appliedDiscounts: DiscountPreview[];
    finalAmount: number;
  }> {
   
    
    // Transform cart items to match backend expectations
    const transformedCartItems = cartItems.map(item => ({
      productVariantId: item.variantId || item.productId, // Use variantId if available, fallback to productId
      productId: item.productId,
      categoryId: item.categoryId,
      price: item.price,
      quantity: item.quantity,
    }));

    const response = await api.post('/discounts/calculate', {
      cartItems: transformedCartItems,
      discountCode,
      customerId,
    });
    
    return response.data.data;
  },
};
