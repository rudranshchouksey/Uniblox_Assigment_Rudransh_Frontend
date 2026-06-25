'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartQuery } from '@/features/cart/useCart';
import { useProductsQuery } from '@/features/products/useProducts';
import { useCheckoutMutation } from '@/features/checkout/useCheckout';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { OrderSummary } from '@/components/shared/OrderSummary';
import { CouponInput } from '@/components/shared/CouponInput';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';

const checkoutSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  discountCode: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { data: products, isLoading: isProductsLoading } = useProductsQuery();
  const checkoutMutation = useCheckoutMutation();

  const [orderResult, setOrderResult] = useState<Order | null>(null);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerId: 'cust_1',
      discountCode: '',
    },
  });

  const onSubmit = (data: CheckoutValues) => {
    checkoutMutation.mutate(
      { customerId: data.customerId, discountCode: data.discountCode || undefined },
      {
        onSuccess: (order) => {
          setOrderResult(order);
        }
      }
    );
  };

  const isLoading = isCartLoading || isProductsLoading;
  const items = cart?.items || [];

  let subtotal = 0;
  const cartItemsWithProducts = items.map(item => {
    const product = products?.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
    return { item, product };
  }).filter(row => row.product !== undefined) as { item: any, product: any }[];

  if (orderResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-6 max-w-2xl mx-auto w-full py-12"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="h-24 w-24 text-green-500 drop-shadow-sm" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order <span className="font-bold text-foreground">#{orderResult.id.slice(0, 8)}</span> has been processed.
          </p>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/30 p-6 border-b border-border/50 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Order Receipt</h2>
            <p className="text-sm font-medium text-muted-foreground">
              {new Date(orderResult.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="p-8 flex flex-col gap-5">
            {orderResult.items.map((orderItem, idx) => {
              const product = products?.find(p => p.id === orderItem.productId);
              return (
                <div key={idx} className="flex justify-between items-center text-base">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{product?.name || 'Unknown Product'}</span>
                    <span className="text-muted-foreground text-sm bg-muted px-2 py-0.5 rounded-md">x{orderItem.quantity}</span>
                  </div>
                  <span className="font-medium">${(orderItem.priceAtPurchase * orderItem.quantity).toFixed(2)}</span>
                </div>
              );
            })}

            <Separator className="my-4 opacity-50" />

            <div className="flex justify-between items-center text-base">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${orderResult.subtotal.toFixed(2)}</span>
            </div>
            {orderResult.discountAmount > 0 && (
              <div className="flex justify-between items-center text-base text-green-600 dark:text-green-500 font-medium bg-green-500/10 -mx-4 px-4 py-2 rounded-lg">
                <span>Discount ({orderResult.discountApplied})</span>
                <span>-${orderResult.discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <Separator className="my-4 opacity-50" />
            
            <div className="flex justify-between items-center text-2xl font-extrabold tracking-tight">
              <span>Total</span>
              <span>${orderResult.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/" className={cn(buttonVariants({ size: "lg" }), "px-12 rounded-xl shadow-lg shadow-primary/20 text-lg")}>
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <LoadingState 
        title="Checkout" 
        type="checkout" 
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        title="Checkout" 
        description="Your cart is empty. You cannot proceed to checkout."
        action={<Link href="/" className={cn(buttonVariants({ size: 'lg' }), "rounded-xl")}>Return to Shop</Link>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      <div className="pb-4 border-b border-border/50">
        <h1 className="text-4xl font-extrabold tracking-tight">Checkout</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Complete your order securely.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start"
      >
        {/* LEFT COLUMN: FORM */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              Payment Details
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="customerId" className="text-base font-semibold">Customer ID</Label>
                <Input
                  id="customerId"
                  placeholder="cust_1"
                  className="rounded-xl h-12 bg-muted/50 border-border/50"
                  {...form.register('customerId')}
                />
                {form.formState.errors.customerId && (
                  <p role="alert" className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                    {form.formState.errors.customerId.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <CouponInput
                  id="discountCode"
                  label="Discount Code (Optional)"
                  placeholder="e.g. SAVE10"
                  registration={form.register('discountCode')}
                  error={form.formState.errors.discountCode?.message}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-lg mt-8 rounded-xl shadow-lg shadow-primary/20 font-bold" 
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? 'Processing Securely...' : `Pay $${subtotal.toFixed(2)}`}
              </Button>

              <div className="flex items-center justify-center text-sm font-medium text-muted-foreground gap-2 pt-6">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Secure, encrypted transaction
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="sticky top-24">
          <OrderSummary 
            items={cartItemsWithProducts.map(({ item, product }) => ({
              name: product.name,
              quantity: item.quantity,
              price: product.price
            }))}
            subtotal={subtotal}
          />
        </div>
      </motion.div>
    </div>
  );
}
