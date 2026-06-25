'use client';

import Link from 'next/link';
import { useCartQuery } from '@/features/cart/useCart';
import { useProductsQuery } from '@/features/products/useProducts';
import { CartItemRow } from '@/features/cart/CartItemRow';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { OrderSummary } from '@/components/shared/OrderSummary';
import { buttonVariants } from '@/components/ui/button';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

  const summaryItems = cartItemsWithProducts.map(({ item, product }) => ({
    name: product.name,
    quantity: item.quantity,
    price: product.price,
    image: product.image
  }));

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full pb-12">
      <div className="pb-4 border-b border-border/50">
        <h1 className="text-4xl font-extrabold tracking-tight">Your Cart</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Review your items before proceeding to checkout.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {cartItemsWithProducts.map(({ item, product }) => (
              <CartItemRow key={item.productId} item={item} product={product} />
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="flex flex-col gap-6">
          <OrderSummary items={summaryItems} subtotal={subtotal} />
          
          <Link 
            href="/checkout" 
            className={cn(
              buttonVariants({ size: "lg" }), 
              "w-full text-lg px-8 h-14 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold group"
            )}
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/" 
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }), 
              "w-full rounded-xl bg-card/50 backdrop-blur-sm border-border/50 hover:bg-muted/50"
            )}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
