import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/lib/api';

interface OrdersStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setCurrentOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed values
  getOrderById: (id: string) => Order | undefined;
  getOrderByCode: (code: string) => Order | undefined;
  getOrdersByStatus: (status: string) => Order[];
  getRecentOrders: (limit?: number) => Order[];
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      setOrders: (orders) => set({ orders }),
      
      addOrder: (order) => {
        const orders = get().orders;
        set({ orders: [order, ...orders] });
      },

      updateOrder: (orderId, updates) => {
        const orders = get().orders;
        set({
          orders: orders.map(order =>
            order.id === orderId ? { ...order, ...updates } : order
          ),
        });
      },

      setCurrentOrder: (currentOrder) => set({ currentOrder }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getOrderById: (id) => {
        return get().orders.find(order => order.id === id);
      },

      getOrderByCode: (code) => {
        return get().orders.find(order => order.orderCode === code);
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status);
      },

      getRecentOrders: (limit = 5) => {
        const orders = get().orders;
        return orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'bulaale-orders-storage',
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder,
      }),
    }
  )
);
