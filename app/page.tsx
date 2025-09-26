"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter, 
  Grid3X3, 
  List,
  Baby,
  Package,
  Truck,
  Shield,
  ChevronDown,
  Menu,
  User,
  Bell
} from "lucide-react";
import { api, Product, Category } from "@/lib/api";
import { useCartStore } from "@/lib/stores/cartStore";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem, getTotalItems } = useCartStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data from API...');
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories")
      ]);
      
      console.log('Products response:', productsRes.data);
      console.log('Categories response:', categoriesRes.data);
      
      // Handle both nested and flat response structures
      setProducts(productsRes.data.products || productsRes.data || []);
      setCategories(categoriesRes.data.categories || categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load products and categories. Please try again later.");
      // Set empty arrays to prevent undefined issues
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category?.id === selectedCategory;
    return matchesSearch && matchesCategory && product.active;
  });

  const addToCart = (product: Product) => {
    console.log('Adding to cart:', product);
    
    // Check if product has variants
    if (!product.variants || product.variants.length === 0) {
      console.log('Cannot add to cart - no variants available');
      return;
    }
    
    const variant = product.variants[0];
    console.log('Variant:', variant);
    console.log('Inventory:', variant?.Inventory);
    
    if (variant && variant.Inventory && variant.Inventory.quantity > 0) {
      const cartItem = {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        price: Number(variant.price || 0),
        quantity: 1,
        image: product.coverImageUrl,
        variant: {
          color: variant.color,
          size: variant.size,
          optionSummary: variant.optionSummary,
        },
      };
      console.log('Cart item:', cartItem);
      addItem(cartItem);
    } else {
      console.log('Cannot add to cart - no Inventory or variant');
    }
  };

  const toggleFavorite = (productId: string) => {
    // TODO: Implement favorite functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={fetchData} className="bg-gradient-brand hover:opacity-90">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-brand p-2 rounded-lg shadow-sm">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-blue">Bulaale</h1>
                <p className="text-sm text-brand-pink font-medium">Baby Care</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for baby products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-brand-pink text-white border-0">
                  3
                </Badge>
              </Button>
              
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-brand-blue text-white border-0">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-brand text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Premium Baby Care
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Quality products for your little ones' comfort and safety
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <Shield className="h-5 w-5" />
              <span>100% Safe</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <Truck className="h-5 w-5" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <Package className="h-5 w-5" />
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Categories</h3>
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="text-sm"
            >
              All Products
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCategory === category.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-medium text-sm">{category.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">
              Products ({filteredProducts.length})
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                      {product.coverImageUrl ? (
                        <img
                          src={product.coverImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {product.variants && product.variants.length > 0 && product.variants[0]?.Inventory?.quantity === 0 && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category?.name}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">4.8</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-brand-blue">
                          ${product.variants && product.variants.length > 0 ? product.variants[0]?.price || 0 : 0}
                        </span>
                        {product.variants && product.variants.length > 0 && product.variants[0]?.Inventory?.quantity && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.variants[0].Inventory.quantity} left)
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={!product.variants || product.variants.length === 0 || product.variants[0]?.Inventory?.quantity === 0}
                        className="bg-gradient-brand hover:opacity-90"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-md transition-all duration-200">
                  <div className="flex">
                    <div className="w-32 h-32 bg-muted rounded-l-lg overflow-hidden flex-shrink-0">
                      {product.coverImageUrl ? (
                        <img
                          src={product.coverImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {product.category?.name}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">4.8</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-lg mb-1">{product.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xl font-bold text-brand-blue">
                                ${product.variants && product.variants.length > 0 ? product.variants[0]?.price || 0 : 0}
                              </span>
                              {product.variants && product.variants.length > 0 && product.variants[0]?.Inventory?.quantity && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({product.variants[0].Inventory.quantity} left)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(product.id)}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => addToCart(product)}
                                disabled={!product.variants || product.variants.length === 0 || product.variants[0]?.Inventory?.quantity === 0}
                                className="bg-gradient-brand hover:opacity-90"
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-brand p-2 rounded-lg shadow-sm">
                  <Baby className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-blue">Bulaale</h3>
                  <p className="text-sm text-brand-pink font-medium">Baby Care</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium baby care products for your little ones' comfort and safety.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Shipping Info</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Track Order</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Size Guide</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Stay Connected</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <div className="flex space-x-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button className="bg-gradient-brand hover:opacity-90">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Bulaale Baby Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
