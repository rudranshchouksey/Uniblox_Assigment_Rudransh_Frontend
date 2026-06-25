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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4 sm:px-8">
        <MobileNav />
        
        <div className="flex flex-1 items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Package2 className="h-6 w-6" />
            <span className="hidden md:inline-block">Acme Store</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ThemeToggle />
          <Link 
            href="/cart" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
          >
            <ShoppingCart className="h-5 w-5" />
            <CartBadge itemCount={cartItemCount} />
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
