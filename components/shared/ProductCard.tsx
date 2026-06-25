'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useAddToCartMutation } from '@/features/cart/useCart';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ViewMode } from '../home/ProductToolbar';

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const addToCartMutation = useAddToCartMutation();

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden bg-muted/30 shrink-0">
          <img
            src={product.image || `https://picsum.photos/seed/${product.id}/400/400`}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-border/50">
            {product.category || 'Category'}
          </Badge>
        </div>

        <div className="flex flex-col flex-1 p-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-xl leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 max-w-lg">
                {product.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-extrabold tracking-tight block">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block mt-2">
                {product.stock} in stock
              </span>
            </div>
          </div>
          
          <div className="mt-auto pt-6 flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-muted/50"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-semibold">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-muted/50"
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              className="rounded-xl font-bold shadow-md shadow-primary/20 h-10 px-6"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || product.stock === 0}
            >
              {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
        <img
          src={product.image || `https://picsum.photos/seed/${product.id}/400/400`}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-border/50 hover:bg-background/90 shadow-sm transition-all duration-300">
          {product.category || 'Category'}
        </Badge>

        {/* Floating Action Button for Quick Add */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-0 right-0 flex justify-center px-4"
            >
              <div className="flex items-center gap-2 bg-background/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-border/50 w-full max-w-[240px]">
                <div className="flex items-center rounded-xl bg-muted/50 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none hover:bg-muted/50"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-xs font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none hover:bg-muted/50"
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  className="flex-1 rounded-xl font-bold shadow-md shadow-primary/20 h-8 text-xs"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || product.stock === 0}
                >
                  <ShoppingCart className="w-3 h-3 mr-1.5" />
                  Add
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md" aria-live="polite">
            {product.stock} in stock
          </span>
        </div>
      </div>
    </motion.div>
  );
}
