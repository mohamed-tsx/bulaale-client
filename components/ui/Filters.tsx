'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Category } from '@/lib/api';

interface FiltersProps {
  categories: Category[];
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  search: string;
  category: string;
  sort: string;
  priceRange: [number, number];
  inStock: boolean;
}

export default function Filters({ categories, onFiltersChange, className = '' }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    sort: 'newest',
    priceRange: [0, 1000],
    inStock: false,
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      sort: 'newest',
      priceRange: [0, 1000] as [number, number],
      inStock: false,
    } satisfies FilterState;
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between h-12 border-gray-300 hover:border-gray-400"
        >
          <span className="flex items-center font-medium">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </span>
          <X className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Search */}
        <div className="space-y-3">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search Products</Label>
          <Input
            id="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="h-10"
          />
        </div>

        {/* Category */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Sort By</Label>
          <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Price Range</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                className="h-10"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
          />
          <Label htmlFor="inStock" className="text-sm font-medium text-gray-700 cursor-pointer">
            In Stock Only
          </Label>
        </div>

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={clearFilters} 
          className="w-full h-10 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
