'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage() {
  const params = useParams();
  const { productId, category } = params;

  const product = products.find(p => p.id === parseInt(productId as string));
  const relatedProducts = products.filter(p => p.category === category && p.id !== parseInt(productId as string)).slice(0, 4);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
        toast({
            title: "Selection Required",
            description: "Please select a size before adding to cart.",
            variant: "destructive",
        });
        return;
    }
    addToCart({ ...product, name: `${product.name}${selectedSize ? ` - ${selectedSize}` : ''}` });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb className="mb-8 font-body">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products/${product.category}`}>{product.categoryDisplayName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-lg overflow-hidden border">
           <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.aiHint}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="font-headline text-4xl mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                  ))}
              </div>
              <span className="text-muted-foreground text-sm">({product.reviewCount} reviews)</span>
          </div>
          <p className="font-body text-4xl font-bold text-primary mb-6">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(product.price)}
          </p>
          
          <div className="mb-6">
              <h3 className="font-headline text-lg mb-2">Description</h3>
              <p className="font-body text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="font-body text-sm mb-6">
              <span className="font-semibold">Material:</span> {product.material}
          </div>

          {product.sizes.length > 0 && (
              <div className="mb-6">
                  <Label className="font-headline text-lg mb-2 block">Size</Label>
                  <RadioGroup 
                    value={selectedSize || ''} 
                    className="flex flex-wrap gap-2 mt-2" 
                    onValueChange={setSelectedSize}
                  >
                      {product.sizes.map(size => (
                         <Label 
                              key={size}
                              htmlFor={`size-${size}-${product.id}`}
                              className={cn(
                                  "px-4 py-2 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                  selectedSize === size ? "bg-primary text-primary-foreground" : "bg-transparent"
                              )}
                          >
                              <RadioGroupItem value={size} id={`size-${size}-${product.id}`} className="sr-only" />
                              {size}
                          </Label>
                      ))}
                  </RadioGroup>
              </div>
          )}

          <div className="flex items-center gap-8 mb-8">
            <div>
              <Label htmlFor="quantity" className="font-headline text-lg mb-2 block">Quantity</Label>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <input id="quantity" type="text" value={quantity} readOnly className="w-16 h-10 text-center font-bold text-lg rounded-md border border-input bg-transparent" />
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => q + 1)}>
                    <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button size="lg" className="w-full font-body text-lg" onClick={handleAddToCart}>
              Add to Cart
          </Button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <Separator />
          <h2 className="font-headline text-3xl text-center my-8 text-primary">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
