'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { productApi, Product } from '@/lib/api';
import AddToCart from '@/components/ui/AddToCart';
import ProductGrid from '@/components/ui/ProductGrid';
import { getImageUrl } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productApi.getById(productId);
      if (response.data.success) {
        console.log(response.data.product);
        setProduct(response.data.product);
        // Fetch related products
        fetchRelatedProducts(response.data.product.categoryId);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: string) => {
    try {
      const response = await productApi.getByCategory(categoryId);
      if (response.data.success) {
        setRelatedProducts(response.data.product.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <a href="/shop">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  const images = product.coverImageUrl ? [product.coverImageUrl] : [];
  const minPrice = Math.min(...product.variants.map(v => Number(v.price)));
  const maxPrice = Math.max(...product.variants.map(v => Number(v.price)));
  const hasMultiplePrices = minPrice !== maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.svg';
              }}
            />
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">(4.9)</span>
              </div>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">In Stock</span>
            </div>

            <div className="text-3xl font-bold text-primary mb-6">
              {hasMultiplePrices ? (
                <span>${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>
              ) : (
                <span>${minPrice.toFixed(2)}</span>
              )}
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCart product={product} />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="flex-1"
            >
              <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">Safe & Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mb-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            <div className="text-gray-600 space-y-2">
              <p><strong>Brand:</strong> {product.brand || 'Bulaale Baby Care'}</p>
              <p><strong>Age Range:</strong> {product.ageMinMonths && product.ageMaxMonths ? 
                `${product.ageMinMonths}-${product.ageMaxMonths} months` : 'All ages'}</p>
              <p><strong>Country of Origin:</strong> {product.countryOfOrigin || 'Somalia'}</p>
              {product.careNotes && (
                <p><strong>Care Notes:</strong> {product.careNotes}</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.variants.map((variant) => (
                <div key={variant.id} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {[variant.size, variant.color].filter(Boolean).join(' - ') || 'Default'}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>SKU:</strong> {variant.sku}</p>
                    <p><strong>Price:</strong> ${Number(variant.price).toFixed(2)}</p>
                    {typeof (variant as any).Inventory !== "undefined" && (
                      <p><strong>Stock:</strong> {(variant as any).Inventory.quantity} available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
