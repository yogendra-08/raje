'use client';

import { useState, useEffect, useMemo } from 'react';
import { products, type Product } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { useParams, notFound } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card } from '@/components/ui/card';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  
  const initialProducts = useMemo(() => {
    if (!category) return [];
    return products.filter(p => p.category === category);
  }, [category]);

  useEffect(() => {
    if (category && initialProducts.length === 0) {
      notFound();
    }
  }, [category, initialProducts]);
  
  const categoryName = initialProducts[0]?.categoryDisplayName;

  const [sortOption, setSortOption] = useState('newest');
  const [showMaharajasPickOnly, setShowMaharajasPickOnly] = useState(false);
  
  const priceExtents = useMemo(() => {
    if (initialProducts.length === 0) return { min: 0, max: 10000 };
    const prices = initialProducts.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [initialProducts]);

  const [priceRange, setPriceRange] = useState<[number, number]>([priceExtents.min, priceExtents.max]);
  
  useEffect(() => {
    setPriceRange([priceExtents.min, priceExtents.max]);
    setSortOption('newest');
    setShowMaharajasPickOnly(false);
  }, [initialProducts, priceExtents]);

  const displayedProducts = useMemo(() => {
    let tempProducts = [...initialProducts];

    if (showMaharajasPickOnly) {
      tempProducts = tempProducts.filter(p => p.isMaharajasPick);
    }

    tempProducts = tempProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortOption) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        tempProducts.sort((a, b) => b.id - a.id);
        break;
    }

    return tempProducts;
  }, [sortOption, showMaharajasPickOnly, priceRange, initialProducts]);

  if (!category) {
    return null; // Or a loading skeleton
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb className="mb-8 font-body">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="font-headline text-4xl md:text-5xl text-center mb-4 text-primary">
          {categoryName}
        </h1>

        <Card className="p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col gap-2">
                  <Label htmlFor="sort-by" className="font-headline">Sort By</Label>
                  <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger id="sort-by" className="w-full">
                          <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              <div className="flex flex-col gap-2">
                   <Label htmlFor="price-range" className="font-headline">
                      Price: Up to {formatPrice(priceRange[1])}
                  </Label>
                  <Slider
                      id="price-range"
                      min={priceExtents.min}
                      max={priceExtents.max}
                      step={100}
                      value={[priceRange[1]]}
                      onValueChange={(value) => setPriceRange([priceExtents.min, value[0]])}
                      className="pt-2"
                  />
              </div>
              
              <div className="flex items-center space-x-2 justify-self-start md:justify-self-center pt-6">
                  <Checkbox id="maharajas-pick" checked={showMaharajasPickOnly} onCheckedChange={(checked) => setShowMaharajasPickOnly(Boolean(checked))} />
                  <Label htmlFor="maharajas-pick" className="font-headline">Maharaj's Picks Only</Label>
              </div>
          </div>
        </Card>

        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="font-headline text-2xl text-primary mb-2">No Artifacts Found</h2>
            <p className="text-muted-foreground font-body">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </>
  );
}
