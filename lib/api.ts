import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4321/api/v1';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:4321';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Check if we're in browser environment before accessing localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    }
    
    // Handle specific HTTP status codes
    if (error.response?.status === 401) {
      // Clear auth token on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    
    return Promise.reject(error);
  }
);

// Utility function to get full image URL
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/placeholder-image.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it starts with /uploads, prepend the image base URL
  if (imagePath.startsWith('/uploads')) return `${IMAGE_BASE_URL}${imagePath}`;
  
  // Otherwise, assume it's a relative path and prepend the image base URL
  return `${IMAGE_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

// Types for our API responses
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Specific response types for different endpoints
export interface ProductApiResponse<T> {
  success: boolean;
  message?: string;
  product: T;
}

export interface OrderApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaymentApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  brand?: string;
  ageMinMonths?: number;
  ageMaxMonths?: number;
  careNotes?: string;
  countryOfOrigin?: string;
  active: boolean;
  coverImageUrl?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color?: string;
  size?: string;
  optionSummary?: string;
  price: string; // Changed from number to string to match backend
  active: boolean;
  images: VariantImage[];
  Inventory?: Inventory;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  position: number;
}

export interface VariantImage {
  id: string;
  productVariantId: string;
  url: string;
  isPrimary: boolean;
}

export interface Inventory {
  id: string;
  productVariantId: string;
  quantity: number;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderCode: string;
  userId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  subtotal: string | number; // Can be string from API or number - updated for currency formatting
  vatAmount?: string | number; // Can be string from API or number - updated for currency formatting
  vatRate?: string | number; // Can be string from API or number - updated for currency formatting
  shippingFee: string | number; // Can be string from API or number - updated for currency formatting
  discountTotal: string | number; // Can be string from API or number - updated for currency formatting
  grandTotal: string | number; // Can be string from API or number - updated for currency formatting
  shippingAddressId?: string;
  notes?: string;
  items: OrderItem[];
  payments: Payment[];
  shipments: Shipment[];
  user?: {
    id: string;
    name: string;
    email: string;
    phonenumber: string;
  };
  shippingAddress?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  qty: number;
  unitPrice: string | number; // Can be string from API or number
  productVariant: {
    id: string;
    sku: string;
    color?: string;
    size?: string;
    optionSummary?: string;
    price: string;
    active: boolean;
    product: {
      id: string;
      name: string;
      description?: string;
      brand?: string;
      coverImageUrl?: string;
    };
  };
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'CASH' | 'EVC_PLUS' | 'ZAAD_SERVICE' | 'SAHAL_SERVICE' | 'BANK_TRANSFER' | 'CREDIT_CARD';
  status: 'INITIATED' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  amount: string | number; // Can be string from API or number
  phone?: string;
  providerTxnId?: string;
  merchantRef?: string;
  meta?: any;
  initiatedAt: string;
  completedAt?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status: 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_DELIVERY' | 'RETURNED';
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API functions
export const productApi = {
  getAll: (params?: {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => api.get<{
    success: boolean;
    message: string;
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>('/products', { params }),
  
  getById: (id: string) => api.get<ProductApiResponse<Product>>(`/products/${id}`),
  getBySlug: (slug: string) => api.get<ProductApiResponse<Product>>(`/products/slug/${slug}`),
  getFeatured: () => api.get<ProductApiResponse<Product[]>>('/products/featured'),
  getByCategory: (categoryId: string) => api.get<ProductApiResponse<Product[]>>(`/products?categoryId=${categoryId}`),
};

export const categoryApi = {
  getAll: () => api.get<{
    success: boolean;
    message: string;
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/categories'),
  getById: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`),
};

export const orderApi = {
  create: (data: any) => api.post<OrderApiResponse<Order>>('/orders', data),
  getAll: (params?: any) => api.get<OrderApiResponse<{orders: Order[], pagination: any}>>('/orders', { params }),
  getById: (id: string) => api.get<OrderApiResponse<Order>>(`/orders/${id}`),
  getByCode: (orderCode: string) => api.get<OrderApiResponse<Order>>(`/orders/track/${orderCode}`),
  getMyOrders: () => api.get<OrderApiResponse<Order[]>>('/orders/me'),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  cancel: (id: string, reason?: string) => api.patch(`/orders/${id}/cancel`, { reason }),
};

export const paymentApi = {
  create: (data: any) => api.post<PaymentApiResponse<Payment>>('/payments', data),
  getById: (id: string) => api.get<PaymentApiResponse<Payment>>(`/payments/${id}`),
  pay: (id: string, data: any) => api.post<PaymentApiResponse<any>>(`/payments/${id}/pay`, data),
  updateStatus: (id: string, status: string, data?: any) => api.patch(`/payments/${id}/status`, { status, ...data }),
};

export const shipmentApi = {
  getByOrderId: (orderId: string) => api.get<ApiResponse<Shipment[]>>(`/shipments/${orderId}`),
};

export const authApi = {
  register: (data: { name: string; email: string; password: string }) => 
    api.post<ApiResponse<{ user: any; token: string }>>('/user/register', data),
  login: (data: { email: string; password: string }) => 
    api.post<ApiResponse<{ user: any; token: string }>>('/user/login', data),
  me: () => api.get<ApiResponse<any>>('/user/me'),
};

export const waafiApi = {
  processPayment: (paymentId: string) => api.post(`/waafi/${paymentId}/process`),
  checkStatus: (paymentId: string) => api.get(`/waafi/${paymentId}/status`),
  getInstructions: (paymentId: string) => api.get(`/waafi/${paymentId}/instructions`),
  acceptPayment: (paymentId: string) => api.post(`/waafi/${paymentId}/accept`),
  denyPayment: (paymentId: string) => api.post(`/waafi/${paymentId}/deny`),
  autoComplete: (paymentId: string, delay?: number) => api.post(`/waafi/${paymentId}/auto-complete`, {}, { params: { delay } }),
};
