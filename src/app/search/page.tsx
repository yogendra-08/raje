'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import SearchBar from '@/components/search-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  SlidersHorizontal, 
  SortAsc, 
  SortDesc,
  Search,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50000],
    rating: 0,
    sortBy: 'name'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.categoryDisplayName)));
  const maxPrice = Math.max(...products.map(p => p.price));

  useEffect(() => {
    let results = products;

    // Apply search query
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.categoryDisplayName.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.material.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      results = results.filter(product => 
        filters.categories.includes(product.categoryDisplayName)
      );
    }

    // Apply price range filter
    results = results.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating > 0) {
      results = results.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredProducts(results);
  }, [query, filters]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      rating: 0,
      sortBy: 'name'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-headline text-primary mb-2">
              {query ? `Search Results for "${query}"` : 'Search Products'}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} products found
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <SearchBar placeholder="Search for royal artifacts..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={maxPrice}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rating Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Minimum Rating</Label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={filters.rating === rating}
                        onCheckedChange={() => handleRatingChange(rating)}
                      />
                      <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1">
                        {rating}+ Stars
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 