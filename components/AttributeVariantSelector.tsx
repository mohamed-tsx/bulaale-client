"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Package, ShoppingCart } from "lucide-react";

interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  optionSummary?: string;
  price: string;
  active: boolean;
  images: any[];
  Inventory?: {
    quantity: number;
  };
}

interface AttributeVariantSelectorProps {
  variants: ProductVariant[];
  onVariantSelect: (variant: ProductVariant | null) => void;
  onAddToCart: (variant: ProductVariant) => void;
  className?: string;
}

export default function AttributeVariantSelector({
  variants,
  onVariantSelect,
  onAddToCart,
  className = "",
}: AttributeVariantSelectorProps) {
  // State for selected attributes
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Extract unique colors and sizes from variants
  const availableColors = Array.from(
    new Set(variants.map(v => v.color).filter(Boolean))
  ) as string[];
  
  const availableSizes = Array.from(
    new Set(variants.map(v => v.size).filter(Boolean))
  ) as string[];

  // Filter variants based on selected attributes
  const getAvailableVariants = () => {
    return variants.filter(variant => {
      const colorMatch = !selectedColor || variant.color === selectedColor;
      const sizeMatch = !selectedSize || variant.size === selectedSize;
      return colorMatch && sizeMatch && variant.active && variant.Inventory && variant.Inventory.quantity > 0;
    });
  };

  // Find the exact variant that matches both selected attributes
  const findExactVariant = () => {
    if (!selectedColor || !selectedSize) return null;
    
    return variants.find(variant => 
      variant.color === selectedColor && 
      variant.size === selectedSize &&
      variant.active &&
      variant.Inventory &&
      variant.Inventory.quantity > 0
    ) || null;
  };

  // Update selected variant when attributes change
  useEffect(() => {
    const exactVariant = findExactVariant();
    setSelectedVariant(exactVariant);
    onVariantSelect(exactVariant);
  }, [selectedColor, selectedSize]);

  // Get available sizes for selected color
  const getAvailableSizesForColor = (color: string) => {
    return variants
      .filter(v => v.color === color && v.active && v.Inventory && v.Inventory.quantity > 0)
      .map(v => v.size)
      .filter(Boolean) as string[];
  };

  // Get available colors for selected size
  const getAvailableColorsForSize = (size: string) => {
    return variants
      .filter(v => v.size === size && v.active && v.Inventory && v.Inventory.quantity > 0)
      .map(v => v.color)
      .filter(Boolean) as string[];
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price));
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Reset size if it's not available for this color
    const availableSizes = getAvailableSizesForColor(color);
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize(null);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Reset color if it's not available for this size
    const availableColors = getAvailableColorsForSize(size);
    if (selectedColor && !availableColors.includes(selectedColor)) {
      setSelectedColor(null);
    }
  };

  const availableVariants = getAvailableVariants();

  if (availableVariants.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center p-6 bg-muted rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-muted-foreground mb-2">Out of Stock</h3>
          <p className="text-sm text-muted-foreground">
            This product is currently unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            Color {selectedColor && `(${selectedColor})`}
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              const isDisabled = selectedSize && !getAvailableSizesForColor(color).includes(selectedSize);
              
              return (
                <Button
                  key={color}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleColorSelect(color)}
                  disabled={isDisabled}
                  className={`flex items-center space-x-2 ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span>{color}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            Size {selectedSize && `(${selectedSize})`}
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              const isDisabled = selectedColor && !getAvailableColorsForSize(size).includes(selectedColor);
              
              return (
                <Button
                  key={size}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSizeSelect(size)}
                  disabled={isDisabled}
                  className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Display */}
      {selectedVariant && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Selected Option</span>
              </div>
              <Badge variant="default" className="text-xs">
                In Stock
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {selectedVariant.color && (
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: selectedVariant.color }}
                    />
                  )}
                  <span className="font-medium">
                    {[selectedVariant.color, selectedVariant.size].filter(Boolean).join(" / ")}
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(selectedVariant.price)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>SKU: {selectedVariant.sku}</span>
                <span>{selectedVariant.Inventory?.quantity || 0} available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add to Cart Button */}
      {selectedVariant && (
        <Button
          onClick={() => onAddToCart(selectedVariant)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart - {formatPrice(selectedVariant.price)}
        </Button>
      )}

      {/* Selection Instructions */}
      {!selectedVariant && (availableColors.length > 0 || availableSizes.length > 0) && (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {availableColors.length > 0 && availableSizes.length > 0
              ? "Please select both color and size to add to cart"
              : "Please select an option to add to cart"}
          </p>
        </div>
      )}
    </div>
  );
}
