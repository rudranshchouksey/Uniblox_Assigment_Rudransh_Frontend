'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, CreditCard, LayoutDashboard, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const routes = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/checkout', label: 'Checkout', icon: CreditCard },
  { href: '/admin', label: 'Admin', icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background/50 backdrop-blur-xl p-4 min-h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2 mt-4">Menu</div>
        <nav className="flex flex-col gap-1">
          {routes.map((route) => {
            const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <route.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
          <Avatar className="h-9 w-9 border border-border/50">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate">Jane Doe</span>
            <span className="text-xs text-muted-foreground truncate">jane@example.com</span>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground ml-auto" />
        </div>
      </div>
    </aside>
  );
}
