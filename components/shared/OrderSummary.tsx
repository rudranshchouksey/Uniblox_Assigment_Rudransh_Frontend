import { Package2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: OrderSummaryItem[];
  subtotal: number;
}

export function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden sticky top-24">
      <div className="bg-muted/50 p-6 border-b flex items-center gap-2">
        <Package2 className="w-5 h-5" />
        <h2 className="font-semibold text-lg">Order Summary</h2>
      </div>
      
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start text-sm">
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground text-xs">Qty: {item.quantity}</span>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
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
  );
}
