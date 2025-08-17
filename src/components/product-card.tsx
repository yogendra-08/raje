'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TurbanIcon } from './icons';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/products';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);

  const handleAction = (callback: () => void) => {
    if (!user) {
      router.push('/login');
    } else {
      callback();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleAction(() => {
      addToCart(product);
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleAction(() => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    });
  };

  return (
    <Link href={`/products/${product.category}/${product.id}`} className="group h-full">
      <Card 
        className={cn("overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative border-2 border-transparent hover:border-accent cursor-pointer h-full flex flex-col")}
      >
        <CardContent className="p-0 flex flex-col flex-grow">
            <div className="relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center bg-gray-100">
              {!imgError ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint={product.aiHint}
                  onError={() => setImgError(true)}
                />
              ) : (
                <span style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '1rem' }}>
                  Currently unavailable
                </span>
              )}
              {product.isMaharajasPick && !imgError && (
                <Badge variant="destructive" className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground border-accent">
                  <TurbanIcon className="w-4 h-4 fill-current" />
                  Maharaj's Pick
                </Badge>
              )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          <div className="p-4 bg-card flex flex-col flex-grow">
              <h3 className="font-headline text-lg font-semibold truncate text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
            <div className="flex items-center justify-between mt-auto pt-2">
              <p className="font-body text-xl font-bold text-primary">{
                new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                }).format(product.price)
              }</p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleLike} aria-label="Like item">
                  <Heart className={`w-5 h-5 transition-colors ${
                    isInWishlist(product.id) 
                      ? 'text-destructive fill-destructive' 
                      : 'text-muted-foreground group-hover:text-destructive'
                  }`} />
                </Button>
                <Button variant="secondary" size="sm" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground" onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
