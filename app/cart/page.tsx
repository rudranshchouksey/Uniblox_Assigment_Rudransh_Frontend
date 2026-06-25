'use client';

import Link from 'next/link';
import { useCartQuery } from '@/features/cart/useCart';
import { useProductsQuery } from '@/features/products/useProducts';
import { CartItemRow } from '@/features/cart/CartItemRow';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { buttonVariants } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';

export default function CartPage() {
  const { data: cart, isLoading: isCartLoading, isError: isCartError } = useCartQuery();
  const { data: products, isLoading: isProductsLoading, isError: isProductsError } = useProductsQuery();

  const isLoading = isCartLoading || isProductsLoading;
  const isError = isCartError || isProductsError;

  if (isLoading) {
    return (
      <LoadingState 
        title="Your Cart" 
        description="Loading your items..." 
        type="list" 
      />
    );
  }

  if (isError) {
    return (
      <ErrorState 
        title="Your Cart" 
        message="Failed to load cart. Please try again later." 
      />
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <EmptyState 
        title="Your cart is empty" 
        description="Looks like you haven't added anything to your cart yet. Let's get you started!"
        icon={<ShoppingCart className="h-12 w-12 text-muted-foreground" />}
        action={
          <Link href="/" className={cn(buttonVariants({ size: 'lg' }), "mt-4 rounded-xl px-8 shadow-md shadow-primary/20")}>
            Continue Shopping
          </Link>
        }
      />
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
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <div className="pb-4 border-b border-border/50">
        <h1 className="text-4xl font-extrabold tracking-tight">Your Cart</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Review your items before proceeding to checkout.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden"
      >
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 bg-muted/30 p-6 border-b border-border/50 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div className="text-right pr-6">Total</div>
        </div>

        <div className="p-4 md:p-6 flex flex-col gap-4">
          {cartItemsWithProducts.map(({ item, product }) => (
            <CartItemRow key={item.productId} item={item} product={product} />
          ))}
        </div>

        <div className="bg-muted/10 p-6 md:p-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full md:w-auto hidden md:inline-flex rounded-xl")}>
            Continue Shopping
          </Link>
          
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="flex items-center gap-6 text-lg">
              <span className="text-muted-foreground font-medium">Subtotal:</span>
              <span className="font-extrabold text-3xl tracking-tight">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Taxes and shipping calculated at checkout.
            </p>
            <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-auto text-lg px-10 rounded-xl shadow-lg shadow-primary/20")}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
