'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlistItems');
    if (storedWishlist) {
      setItems(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        toast({
          title: 'Already in Wishlist',
          description: `${product.name} is already in your wishlist.`,
        });
        return prevItems;
      }
      const newItems = [...prevItems, product];
      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
      return newItems;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      const newItems = prevItems.filter(item => item.id !== productId);
      if (itemToRemove) {
        toast({
          title: 'Removed from Wishlist',
          description: `${itemToRemove.name} has been removed from your wishlist.`,
        });
      }
      return newItems;
    });
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: 'Wishlist Cleared',
      description: 'All items have been removed from your wishlist.',
    });
  };

  const totalItems = items.length;

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    totalItems,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 