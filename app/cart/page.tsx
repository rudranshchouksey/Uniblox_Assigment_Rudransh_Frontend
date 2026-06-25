'use client';

import Link from 'next/link';
import { useCartQuery } from '@/features/cart/useCart';
import { useProductsQuery } from '@/features/products/useProducts';
import { CartItemRow } from '@/features/cart/CartItemRow';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { data: cart, isLoading: isCartLoading, isError: isCartError } = useCartQuery();
  const { data: products, isLoading: isProductsLoading, isError: isProductsError } = useProductsQuery();

  const isLoading = isCartLoading || isProductsLoading;
  const isError = isCartError || isProductsError;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
          <p className="text-muted-foreground mt-2">Loading your items...</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="flex justify-end mt-4">
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        <div className="rounded-xl border border-destructive bg-destructive/10 p-6 text-center text-destructive">
          Failed to load cart. Please try again later.
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-md">
            Looks like you haven't added anything to your cart yet. Let's get you started!
          </p>
          <Link href="/" className={cn(buttonVariants(), "mt-4")}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  let subtotal = 0;
  const cartItemsWithProducts = items.map(item => {
    const product = products?.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
    return { item, product };
  }).filter(row => row.product !== undefined) as { item: any, product: any }[];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        <p className="text-muted-foreground mt-2">
          Review your items before proceeding to checkout.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 bg-muted/50 p-4 border-b font-medium text-sm text-muted-foreground">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div className="text-right pr-6">Total</div>
        </div>

        <div className="p-4 md:p-6 flex flex-col gap-2">
          {cartItemsWithProducts.map(({ item, product }) => (
            <CartItemRow key={item.productId} item={item} product={product} />
          ))}
        </div>

        <div className="bg-muted/30 p-4 md:p-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full md:w-auto hidden md:inline-flex")}>
            Continue Shopping
          </Link>
          
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 text-lg">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-bold text-2xl">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground -mt-2 mb-2">
              Taxes and shipping calculated at checkout.
            </p>
            <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-auto text-lg px-8")}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
