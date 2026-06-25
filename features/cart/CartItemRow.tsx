'use client';

import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useUpdateCartItemMutation, useRemoveCartItemMutation } from './useCart';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={`group flex flex-col md:flex-row gap-6 items-start md:items-center p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted/30 shrink-0 border border-border/50">
        <img 
          src={product.image || `https://picsum.photos/seed/${product.id}/400/400`} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
        <div className="text-sm font-semibold bg-muted/50 w-fit px-2 py-1 rounded-md">
          ${product.price.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center rounded-xl border border-border/50 bg-muted/20 overflow-hidden shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none hover:bg-muted/50"
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center text-sm font-semibold">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none hover:bg-muted/50"
            onClick={handleIncrease}
            disabled={item.quantity >= product.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <span className="font-bold text-lg w-24 text-right">
            ${(product.price * item.quantity).toFixed(2)}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
