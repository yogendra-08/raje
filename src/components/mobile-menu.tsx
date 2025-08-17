'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  Heart, 
  Package, 
  Settings, 
  LogOut,
  Shield,
  Crown,
  BookOpen,
  Sword,
  Gift,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { usePathname } from 'next/navigation';

const mobileNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/products/royal-attire', label: 'Royal Attire', icon: Crown },
  { href: '/products/wooden-weapons', label: 'Wooden Weapons', icon: Sword },
  { href: '/products/handicrafts', label: 'Handicrafts', icon: Shield },
  { href: '/products/historical-books', label: 'Historical Books', icon: BookOpen },
  { href: '/products/souvenirs', label: 'Souvenirs', icon: Gift },
  { href: '/ai-styler', label: 'AI Styler', icon: Crown },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-headline font-bold text-primary">
                RajyaBazaar
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.displayName || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mb-6">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {mobileNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3 h-12"
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4" />

          {/* Quick Actions */}
          <div className="space-y-2">
            <Link href="/cart" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <ShoppingCart className="h-5 w-5" />
                Cart
                {totalItems > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {user && (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <User className="h-5 w-5" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard?tab=wishlist" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </Button>
                </Link>
                <Link href="/dashboard?tab=orders" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <Package className="h-5 w-5" />
                    Orders
                  </Button>
                </Link>
                <Link href="/dashboard?tab=profile" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <Settings className="h-5 w-5" />
                    Profile
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Sign Out */}
          {user && (
            <>
              <Separator className="my-4" />
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 