import { ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderSummaryProps {
  items: OrderSummaryItem[];
  subtotal: number;
  discountApplied?: string;
  discountAmount?: number;
}

export function OrderSummary({ items, subtotal, discountApplied, discountAmount = 0 }: OrderSummaryProps) {
  const taxes = 0; // Placeholder for taxes
  const total = subtotal - discountAmount + taxes;

  return (
    <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl text-card-foreground shadow-lg overflow-hidden sticky top-24">
      <div className="bg-primary/5 p-6 border-b border-border/50 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-xl">Order Summary</h2>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 text-sm group">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted/30 shrink-0 border border-border/50">
                <img 
                  src={item.image || `https://picsum.photos/seed/${item.name}/400/400`} 
                  alt={item.name} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-card">
                  {item.quantity}
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold line-clamp-2">{item.name}</span>
                <span className="text-muted-foreground text-xs mt-1">Qty: {item.quantity}</span>
              </div>
              <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator className="opacity-50" />

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm font-medium text-green-500">
              <span>Discount ({discountApplied})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Taxes</span>
            <span className="font-semibold">${taxes.toFixed(2)}</span>
          </div>
        </div>
        
        <Separator className="opacity-50" />

        <div className="flex justify-between items-center text-2xl font-extrabold tracking-tight">
          <span>Total</span>
          <span>${Math.max(0, total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
