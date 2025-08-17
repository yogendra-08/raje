'use client';

import Link from 'next/link';
import { Shield, ShoppingCart, LogIn, Home, Wand2, LogOut, User as UserIcon, BookOpen } from 'lucide-react';
import MobileMenu from './mobile-menu';
import SearchBar from './search-bar';
import ThemeToggle from './theme-toggle';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { href: '/blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/ai-styler', label: 'AI Styler', icon: <Wand2 className="w-4 h-4" /> },
];

function AuthNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (user) {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <UserIcon className="w-5 h-5" />
            <span className="hidden md:inline">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Orders</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant="ghost" asChild className={cn(
      'font-body',
      pathname === '/login' && 'bg-accent/20 text-accent-foreground'
    )}>
      <Link href="/login">
        <LogIn className="w-4 h-4" />
        Login
      </Link>
    </Button>
  )
}

export default function Header() {
  const pathname = usePathname();
  const { loading, isFirebaseConfigured } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
          <span className="text-2xl font-headline font-bold text-primary">
            RajyaBazaar
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
          <SearchBar />
        </div>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild className={cn(
              'font-body',
              pathname === link.href && 'bg-accent/20 text-accent-foreground'
            )}>
              <Link href={link.href}>
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
           {!loading && isFirebaseConfigured && <AuthNav />}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{totalItems}</Badge>
              )}
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
