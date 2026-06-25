'use client';

import Link from 'next/link';
import { Package2, ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from './MobileNav';
import { buttonVariants } from '@/components/ui/button';
import { CartBadge } from '@/components/shared/CartBadge';
import { cn } from '@/lib/utils';
import { useCartQuery } from '@/features/cart/useCart';

export function Navbar() {
  const { data: cart } = useCartQuery();
  
  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto max-w-[1600px] flex h-16 items-center gap-4 px-4 sm:px-8">
        <MobileNav />
        
        <div className="flex items-center gap-6 md:gap-8 flex-1">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-lg">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-md shadow-primary/20">
              <Package2 className="h-5 w-5" />
            </div>
            <span className="hidden md:inline-block">Acme SaaS</span>
          </Link>
          
          <div className="hidden md:flex relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search products, orders, and customers..." 
              className="w-full bg-muted/50 border border-border/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="relative p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-full transition-colors hidden sm:block">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
          </button>
          
          <ThemeToggle />
          
          <Link 
            href="/cart" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative rounded-full hover:bg-muted/80")}
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            <CartBadge itemCount={cartItemCount} />
          </Link>
        </div>
      </div>
    </header>
  );
}
