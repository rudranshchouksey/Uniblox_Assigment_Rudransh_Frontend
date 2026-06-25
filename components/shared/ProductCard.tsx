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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      
      {/* Image Container with Hover Scale */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6 pb-4">
        <h3 className="font-semibold text-lg leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {product.stock} in stock
          </span>
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto flex flex-col gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center rounded-md border border-input">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 rounded-none border-r border-input"
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
              className="h-8 w-8 rounded-none border-l border-input"
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            className="flex-1"
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
    </div>
  );
}
