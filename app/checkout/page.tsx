'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartQuery } from '@/features/cart/useCart';
import { useProductsQuery } from '@/features/products/useProducts';
import { useCheckoutMutation } from '@/features/checkout/useCheckout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package2, ShieldCheck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';

const checkoutSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  discountCode: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

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
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full py-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
          <h1 className="text-4xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order <span className="font-medium text-foreground">#{orderResult.id.slice(0, 8)}</span> has been processed.
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
          <div className="bg-muted/50 p-6 border-b">
            <h2 className="font-semibold text-lg">Order Receipt</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(orderResult.createdAt).toLocaleDateString()} at {new Date(orderResult.createdAt).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="p-6 flex flex-col gap-4">
            {orderResult.items.map((orderItem, idx) => {
              const product = products?.find(p => p.id === orderItem.productId);
              return (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{product?.name || 'Unknown Product'}</span>
                    <span className="text-muted-foreground">x{orderItem.quantity}</span>
                  </div>
                  <span>${(orderItem.priceAtPurchase * orderItem.quantity).toFixed(2)}</span>
                </div>
              );
            })}

            <Separator className="my-2" />

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${orderResult.subtotal.toFixed(2)}</span>
            </div>
            {orderResult.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-500 font-medium">
                <span>Discount ({orderResult.discountApplied})</span>
                <span>-${orderResult.discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>${orderResult.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/" className={cn(buttonVariants({ size: "lg" }), "px-12")}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        </div>
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-xl mx-auto w-full text-center py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Checkout</h1>
        <p className="text-muted-foreground">Your cart is empty. You cannot proceed to checkout.</p>
        <div className="mt-4">
          <Link href="/" className={buttonVariants()}>Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Complete your order securely.
        </p>
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 items-start">
        {/* LEFT COLUMN: FORM */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  placeholder="cust_1"
                  {...form.register('customerId')}
                />
                {form.formState.errors.customerId && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.customerId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountCode">Discount Code (Optional)</Label>
                <Input
                  id="discountCode"
                  placeholder="e.g. SAVE10"
                  {...form.register('discountCode')}
                />
                {form.formState.errors.discountCode && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.discountCode.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg mt-4" 
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? 'Processing...' : `Pay $${subtotal.toFixed(2)}`}
              </Button>

              <div className="flex items-center justify-center text-xs text-muted-foreground gap-2 pt-4">
                <ShieldCheck className="w-4 h-4" />
                Secure, encrypted transaction
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden sticky top-24">
          <div className="bg-muted/50 p-6 border-b flex items-center gap-2">
            <Package2 className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Order Summary</h2>
          </div>
          
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
              {cartItemsWithProducts.map(({ item, product }) => (
                <div key={item.productId} className="flex justify-between items-start text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground text-xs">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-medium">${(product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between items-center font-bold text-lg">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Final totals including discounts will be calculated upon order submission.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
