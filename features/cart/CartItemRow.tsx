'use client';

import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '@/components/shared/QuantitySelector';
import { useUpdateCartItemMutation, useRemoveCartItemMutation } from './useCart';

interface CartItemRowProps {
  item: CartItem;
  product: Product;
}

export function CartItemRow({ item, product }: CartItemRowProps) {
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateMutation.mutate({ productId: item.productId, quantity: item.quantity - 1 });
    }
  };

  const handleIncrease = () => {
    if (item.quantity < product.stock) {
      updateMutation.mutate({ productId: item.productId, quantity: item.quantity + 1 });
    }
  };

  const handleRemove = () => {
    removeMutation.mutate({ productId: item.productId });
  };

  const isUpdating = updateMutation.isPending || removeMutation.isPending;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center py-4 border-b ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex flex-col">
        <span className="font-semibold">{product.name}</span>
        <span className="text-sm text-muted-foreground md:hidden">${product.price.toFixed(2)}</span>
      </div>
      
      <div className="hidden md:block">
        ${product.price.toFixed(2)}
      </div>

      <div className="flex items-center">
        <QuantitySelector 
          quantity={item.quantity}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          max={product.stock}
        />
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6">
        <span className="font-bold">
          ${(product.price * item.quantity).toFixed(2)}
        </span>
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
