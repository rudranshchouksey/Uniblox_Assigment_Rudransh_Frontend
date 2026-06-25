'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartQuery } from '@/features/cart/useCart';
import { useProductsQuery } from '@/features/products/useProducts';
import { useCheckoutMutation } from '@/features/checkout/useCheckout';
import { useValidateDiscountMutation } from '@/features/cart/useCart';
import { LoadingState } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { OrderSummary } from '@/components/shared/OrderSummary';
import { CouponInput } from '@/components/shared/CouponInput';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';
import { motion, AnimatePresence } from 'framer-motion';

const checkoutSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  discountCode: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { data: products, isLoading: isProductsLoading } = useProductsQuery();
  const checkoutMutation = useCheckoutMutation();
  const validateDiscountMutation = useValidateDiscountMutation();

  const [orderResult, setOrderResult] = useState<Order | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validCoupon, setValidCoupon] = useState('');

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerId: 'cust_1',
      discountCode: '',
    },
  });

  const couponValue = form.watch('discountCode');

  const items = cart?.items || [];
  let subtotal = 0;
  
  const cartItemsWithProducts = items.map(item => {
    const product = products?.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
    return { item, product };
  }).filter(row => row.product !== undefined) as { item: any, product: any }[];

  useEffect(() => {
    if (couponValue && couponValue.length > 3) {
      // Small debounce for validation
      const timer = setTimeout(() => {
        validateDiscountMutation.mutate({ code: couponValue, cartSubtotal: subtotal }, {
          onSuccess: (data) => {
            setValidCoupon(couponValue);
            setDiscountAmount(data.discountAmount);
            form.clearErrors('discountCode');
          },
          onError: (error: any) => {
            setValidCoupon('');
            setDiscountAmount(0);
            form.setError('discountCode', { 
              type: 'manual', 
              message: error.response?.data?.message || 'Invalid discount code'
            });
          }
        });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setValidCoupon('');
      setDiscountAmount(0);
    }
  }, [couponValue, subtotal]);

  const onSubmit = (data: CheckoutValues) => {
    checkoutMutation.mutate(
      { customerId: data.customerId, discountCode: validCoupon || undefined },
      {
        onSuccess: (order) => {
          setOrderResult(order);
        }
      }
    );
  };

  const isLoading = isCartLoading || isProductsLoading;

  if (orderResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-8 max-w-2xl mx-auto w-full py-16"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-6 mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="bg-green-500/10 p-4 rounded-full"
          >
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Your order <span className="font-bold text-foreground">#{orderResult.id.slice(0, 8)}</span> has been securely processed. A receipt has been sent to your email.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl text-card-foreground shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="bg-muted/30 p-6 md:p-8 border-b border-border/50 flex justify-between items-center">
            <h2 className="font-bold text-xl">Order Receipt</h2>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="font-semibold">{new Date(orderResult.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="space-y-4">
              {orderResult.items.map((orderItem, idx) => {
                const product = products?.find(p => p.id === orderItem.productId);
                return (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/50 overflow-hidden border border-border/50">
                         <img src={product?.image || `https://picsum.photos/seed/${product?.id}/100/100`} alt={product?.name || 'Product'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold block">{product?.name || 'Unknown Product'}</span>
                        <span className="text-muted-foreground text-xs font-medium">Qty: {orderItem.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold">${(orderItem.priceAtPurchase * orderItem.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span>Subtotal</span>
                <span>${orderResult.subtotal.toFixed(2)}</span>
              </div>
              {orderResult.discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm font-semibold text-green-500">
                  <span>Discount ({orderResult.discountApplied})</span>
                  <span>-${orderResult.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <Separator className="opacity-50" />
            
            <div className="flex justify-between items-center text-3xl font-extrabold tracking-tight">
              <span>Total Paid</span>
              <span>${orderResult.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Link href="/" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "px-12 rounded-xl text-base h-14 bg-background border-border/50 hover:bg-muted/50")}>
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return <LoadingState title="Checkout" type="checkout" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        title="Checkout Unavailable" 
        description="Your cart is completely empty. Add some premium items before checking out."
        action={<Link href="/" className={cn(buttonVariants({ size: 'lg' }), "rounded-xl")}>Return to Shop</Link>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full pb-12">
      {/* Timeline/Progress Indicator */}
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4">
        <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">Checkout</span>
        <ChevronRight className="w-4 h-4" />
        <span>Confirmation</span>
      </div>

      <div className="pb-4 border-b border-border/50">
        <h1 className="text-4xl font-extrabold tracking-tight">Complete your Order</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Almost there! Review your details and finalize the payment.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="grid lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1.2fr] gap-8 lg:gap-16 items-start"
      >
        {/* LEFT COLUMN: CUSTOMER DETAILS */}
        <div className="flex flex-col gap-8">
          <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                <CreditCard className="w-6 h-6" />
              </div>
              Payment Details
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="customerId" className="text-base font-semibold">Customer ID</Label>
                <Input
                  id="customerId"
                  placeholder="cust_1"
                  className="rounded-xl h-14 bg-muted/50 border-border/50 focus-visible:ring-primary text-base"
                  {...form.register('customerId')}
                />
                {form.formState.errors.customerId && (
                  <p role="alert" className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                    {form.formState.errors.customerId.message}
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <Label htmlFor="discountCode" className="text-base font-semibold">Gift Card or Discount Code</Label>
                <div className="relative">
                  <Input
                    id="discountCode"
                    placeholder="Enter code (e.g. WELCOME10)"
                    className={cn(
                      "rounded-xl h-14 bg-muted/50 border-border/50 focus-visible:ring-primary text-base pr-24",
                      validCoupon ? "border-green-500/50 focus-visible:ring-green-500" : ""
                    )}
                    {...form.register('discountCode')}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {validateDiscountMutation.isPending ? (
                      <span className="text-xs font-semibold text-muted-foreground animate-pulse">Checking...</span>
                    ) : validCoupon ? (
                      <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg">Applied</span>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">Optional</span>
                    )}
                  </div>
                </div>
                {form.formState.errors.discountCode && (
                  <p role="alert" className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                    {form.formState.errors.discountCode.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-16 text-xl mt-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold" 
                disabled={checkoutMutation.isPending || validateDiscountMutation.isPending}
              >
                {checkoutMutation.isPending ? 'Processing securely...' : `Pay $${Math.max(0, subtotal - discountAmount).toFixed(2)}`}
              </Button>

              <div className="flex items-center justify-center text-sm font-medium text-muted-foreground gap-2 pt-6 pb-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Payments are securely processed and encrypted.
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
              price: product.price,
              image: product.image
            }))}
            subtotal={subtotal}
            discountApplied={validCoupon}
            discountAmount={discountAmount}
          />
        </div>
      </motion.div>
    </div>
  );
}
