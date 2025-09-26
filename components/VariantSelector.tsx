"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Package } from "lucide-react";

interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  optionSummary?: string;
  price: number;
  active: boolean;
  images: any[];
  Inventory?: {
    quantity: number;
  };
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
  onAddToCart: (variant: ProductVariant) => void;
  className?: string;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onVariantSelect,
  onAddToCart,
  className = "",
}: VariantSelectorProps) {
  // Filter to only show active variants with inventory
  const availableVariants = variants.filter(
    variant => variant.active && variant.Inventory && variant.Inventory.quantity > 0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getVariantDisplayName = (variant: ProductVariant) => {
    const parts = [];
    if (variant.color) parts.push(variant.color);
    if (variant.size) parts.push(variant.size);
    return parts.length > 0 ? parts.join(" / ") : "Default";
  };

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
    <div className={`space-y-4 ${className}`}>
      {/* Variant Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">
          Available Options ({availableVariants.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableVariants.map((variant) => (
            <Card
              key={variant.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedVariant?.id === variant.id
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => onVariantSelect(variant)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {variant.color && (
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: variant.color }}
                      />
                    )}
                    <span className="font-medium text-sm">
                      {getVariantDisplayName(variant)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">
                      {variant.Inventory?.quantity || 0} left
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(variant.price)}
                  </span>
                  {selectedVariant?.id === variant.id && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add to Cart Section */}
      {selectedVariant && (
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Selected Option</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{getVariantDisplayName(selectedVariant)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(selectedVariant.price)} • {selectedVariant.Inventory?.quantity || 0} available
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">In Stock</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => onAddToCart(selectedVariant)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
            size="lg"
          >
            Add to Cart - {formatPrice(selectedVariant.price)}
          </Button>
        </div>
      )}

      {/* No Selection Message */}
      {!selectedVariant && availableVariants.length > 0 && (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Please select an option to add to cart
          </p>
        </div>
      )}
    </div>
  );
}
