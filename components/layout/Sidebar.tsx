import Link from 'next/link';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
  { href: '/admin', label: 'Admin' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 p-6 min-h-[calc(100vh-3.5rem)] sticky top-14">
      <nav className="flex flex-col gap-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
