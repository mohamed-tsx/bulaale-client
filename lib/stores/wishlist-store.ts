import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/api';

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (productId) => {
        const items = get().items;
        const existingItem = items.find(item => item.productId === productId);
        
        if (!existingItem) {
          const newItem: WishlistItem = {
            id: `${productId}-${Date.now()}`,
            productId,
            addedAt: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          items: get().items.filter(item => item.productId !== productId),
        });
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getWishlistCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'bulaale-wishlist-storage',
    }
  )
);
