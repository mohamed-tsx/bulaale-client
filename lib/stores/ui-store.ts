import { create } from 'zustand';

interface UIStore {
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Modal states
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
  }>;
  addNotification: (notification: Omit<UIStore['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Sidebar state
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Modal states
  isCartOpen: false,
  isWishlistOpen: false,
  isSearchOpen: false,
  setCartOpen: (isCartOpen) => set({ isCartOpen }),
  setWishlistOpen: (isWishlistOpen) => set({ isWishlistOpen }),
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),

  // Theme
  theme: 'system',
  setTheme: (theme) => set({ theme }),

  // Loading states
  globalLoading: false,
  setGlobalLoading: (globalLoading) => set({ globalLoading }),

  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = {
      ...notification,
      id,
      timestamp: Date.now(),
    };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(notification => notification.id !== id),
    }));
  },
  clearNotifications: () => set({ notifications: [] }),
}));
