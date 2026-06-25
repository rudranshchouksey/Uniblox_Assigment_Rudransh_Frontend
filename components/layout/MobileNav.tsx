import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Package2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
  { href: '/admin', label: 'Admin' },
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <nav className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-6">
            <Package2 className="h-6 w-6" />
            <span>Acme Store</span>
          </Link>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-muted-foreground hover:text-foreground text-lg"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
