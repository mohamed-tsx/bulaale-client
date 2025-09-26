import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4321/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Types for our API responses
export interface Product {
  id: string;
  name: string;
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
  price: number;
  active: boolean;
  images: VariantImage[];
  Inventory?: Inventory;
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
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderCode: string;
  userId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  grandTotal: number;
  shippingAddressId?: string;
  notes?: string;
  items: OrderItem[];
  payments: Payment[];
  shipments: Shipment[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  qty: number;
  unitPrice: number;
  productVariant: ProductVariant;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'CASH' | 'EVC_PLUS' | 'ZAAD_SERVICE' | 'SAHAL_SERVICE' | 'BANK_TRANSFER' | 'CREDIT_CARD';
  status: 'INITIATED' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  amount: number;
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
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  getByCategory: (categoryId: string) => api.get<Product[]>(`/products?categoryId=${categoryId}`),
};

export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: string) => api.get<Category>(`/categories/${id}`),
};

export const orderApi = {
  create: (data: any) => api.post<Order>('/orders', data),
  getAll: (params?: any) => api.get<{orders: Order[], pagination: any}>('/orders', { params }),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  cancel: (id: string, reason?: string) => api.patch(`/orders/${id}/cancel`, { reason }),
};

export const paymentApi = {
  create: (data: any) => api.post<Payment>('/payments', data),
  getById: (id: string) => api.get<Payment>(`/payments/${id}`),
  updateStatus: (id: string, status: string, data?: any) => api.patch(`/payments/${id}/status`, { status, ...data }),
};

export const waafiApi = {
  processPayment: (paymentId: string) => api.post(`/waafi/${paymentId}/process`),
  checkStatus: (paymentId: string) => api.get(`/waafi/${paymentId}/status`),
  getInstructions: (paymentId: string) => api.get(`/waafi/${paymentId}/instructions`),
  acceptPayment: (paymentId: string) => api.post(`/waafi/${paymentId}/accept`),
  denyPayment: (paymentId: string) => api.post(`/waafi/${paymentId}/deny`),
  autoComplete: (paymentId: string, delay?: number) => api.post(`/waafi/${paymentId}/auto-complete`, {}, { params: { delay } }),
};
