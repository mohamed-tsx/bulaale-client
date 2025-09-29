import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant: {
    color?: string;
    size?: string;
    optionSummary?: string;
    sku?: string;
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getItemById: (id: string) => CartItem | undefined;
  isItemInCart: (variantId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        
        // Ensure price is always a number
        const normalizedItem = {
          ...item,
          price: Number(item.price || 0)
        };
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + normalizedItem.quantity }
                : i
            ),
          });
        } else {
          // Generate unique ID using timestamp and random number to prevent conflicts
          const uniqueId = `${normalizedItem.productId}-${normalizedItem.variantId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          set({
            items: [...items, { ...normalizedItem, id: uniqueId }],
          });
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemById: (id) => {
        return get().items.find(item => item.id === id);
      },

      isItemInCart: (variantId) => {
        return get().items.some(item => item.variantId === variantId);
      },
    }),
    {
      name: 'bulaale-cart-storage',
    }
  )
);