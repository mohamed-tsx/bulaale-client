import { Product } from '@/lib/api';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  variant?: 'default' | 'minimal';
  loading?: boolean;
}

export default function ProductGrid({ products, variant = 'default', loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse shadow-sm">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16" />
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 shadow-sm">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any products matching your criteria. Try adjusting your search terms or filters to discover more items.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Clear Filters
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
