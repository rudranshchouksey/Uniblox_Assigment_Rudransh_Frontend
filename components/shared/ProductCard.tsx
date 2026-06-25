'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useAddToCartMutation } from '@/features/cart/useCart';

import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

import { motion } from 'framer-motion';

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCartMutation = useAddToCartMutation();

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
    });
  };

  // Using a consistent placeholder image based on product ID
  const imageUrl = `https://picsum.photos/seed/${product.id}/400/400`;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-shadow"
    >
      {/* Image Container with Hover Scale */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 pb-4">
        <h3 className="font-semibold text-lg leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md" aria-live="polite">
            {product.stock} in stock
          </span>
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto flex flex-col gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-9 w-9 rounded-none hover:bg-muted/50"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium" aria-live="polite">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-9 w-9 rounded-none hover:bg-muted/50"
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            className="flex-1 rounded-xl font-semibold shadow-md shadow-primary/20"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || product.stock === 0}
            aria-label={`Add ${quantity} ${product.name} to cart`}
          >
            {addToCartMutation.isPending ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
