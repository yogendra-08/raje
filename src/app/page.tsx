'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/product-card';
import { Brush, BookOpen, Swords, Gift, Shirt } from 'lucide-react';
import { products } from '@/lib/products';

const categories = [
  { name: 'Handicrafts', icon: <Brush className="w-12 h-12" />, href: '/products/handicrafts' },
  { name: 'Royal Attire', icon: <Shirt className="w-12 h-12" />, href: '/products/royal-attire' },
  { name: 'Historical Books', icon: <BookOpen className="w-12 h-12" />, href: '/products/historical-books' },
  { name: 'Wooden Weapons', icon: <Swords className="w-12 h-12" />, href: '/products/wooden-weapons' },
  { name: 'Souvenirs', icon: <Gift className="w-12 h-12" />, href: '/products/souvenirs' },
];

export default function Home() {
  const trendingItems = products.slice(0, 8);

  return (
    <>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full aspect-[16/9] flex items-center justify-center text-white">
          <Image
            src="/main.jpg"
            alt="A majestic statue of Chhatrapati Shivaji Maharaj"
            layout="fill"
            objectFit="contain"
            className="brightness-75"
            data-ai-hint="chhatrapati shivaji maharaj statue"
          />
          <div className="relative z-10 text-left p-8 md:p-12 lg:p-16 w-full flex flex-col items-start justify-center h-full">
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-saffron-300 drop-shadow-lg" style={{color: 'hsl(var(--accent))'}}>
              RajyaBazaar
            </h1>
            <p className="font-body text-lg md:text-xl lg:text-2xl mt-4 max-w-md">
              Where Heritage Meets Craft.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="#trending">Explore the Legacy</Link>
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-4xl md:text-5xl text-center mb-12 text-primary">
              Our Royal Collections
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
              {categories.map((category) => (
                <Link key={category.name} href={category.href}>
                  <Card className="group text-center p-6 bg-card hover:bg-card/80 transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer shadow-lg rounded-lg border-2 border-transparent hover:border-accent">
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                      <div className="text-primary group-hover:text-accent transition-colors">
                        {category.icon}
                      </div>
                      <h3 className="font-headline text-xl font-semibold text-foreground">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Items Section */}
        <section id="trending" className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-4xl md:text-5xl text-center mb-12 text-primary">
              Trending Royal Artifacts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
