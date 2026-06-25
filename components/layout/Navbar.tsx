import Link from 'next/link';
import { Package2, ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from './MobileNav';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Navbar() {
  const cartItemCount = 0;

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
          <Link 
            href="/cart" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
