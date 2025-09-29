import { create } from 'zustand';
import { Product, Category } from '@/lib/api';

interface ProductsStore {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  viewMode: 'grid' | 'list';
  
  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setFeaturedProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  clearError: () => void;
  
  // Computed values
  getFilteredProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'name',
  viewMode: 'grid',

  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setFeaturedProducts: (featuredProducts) => set({ featuredProducts }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  clearError: () => set({ error: null }),

  getFilteredProducts: () => {
    const { products, searchQuery, selectedCategory, sortBy } = get();
    
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category?.id === selectedCategory;
      return matchesSearch && matchesCategory && product.active;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          const aPrice = a.variants[0]?.price || 0;
          const bPrice = b.variants[0]?.price || 0;
          return Number(aPrice) - Number(bPrice);
        case 'price-high':
          const aPriceHigh = a.variants[0]?.price || 0;
          const bPriceHigh = b.variants[0]?.price || 0;
          return Number(bPriceHigh) - Number(aPriceHigh);
        default:
          return 0;
      }
    });

    return filtered;
  },

  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },

  getProductsByCategory: (categoryId) => {
    return get().products.filter(product => 
      product.category?.id === categoryId && product.active
    );
  },
}));
