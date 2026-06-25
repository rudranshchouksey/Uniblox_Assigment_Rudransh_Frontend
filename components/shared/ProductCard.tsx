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
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl text-card-foreground shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
      >
        <div className="relative w-full sm:w-72 h-64 sm:h-auto overflow-hidden bg-muted/20 shrink-0">
          <img
            src={product.image || `https://picsum.photos/seed/${product.id}/400/400`}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 sm:block hidden pointer-events-none" />
          <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-foreground font-semibold px-3 py-1 border-border/50">
            {product.category || 'Category'}
          </Badge>
        </div>

        <div className="flex flex-col flex-1 p-6 sm:p-8 justify-center">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="font-extrabold text-2xl leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-base text-muted-foreground line-clamp-2 max-w-lg leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0 mt-2 sm:mt-0">
              <span className="text-3xl font-extrabold tracking-tight block text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md inline-block mt-2">
                {product.stock} in stock
              </span>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-2xl border border-border/50 bg-muted/10 overflow-hidden h-12">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-none hover:bg-muted/50 transition-colors"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-sm font-bold">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-none hover:bg-muted/50 transition-colors"
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              className="rounded-2xl font-bold shadow-lg shadow-primary/25 h-12 px-8 text-base transition-all hover:shadow-primary/40 active:scale-95"
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl text-card-foreground shadow-sm hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
        <img
          src={product.image || `https://picsum.photos/seed/${product.id}/600/600`}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-xl text-foreground font-semibold px-3 py-1 border-none shadow-sm group-hover:bg-background transition-colors duration-300">
          {product.category || 'Category'}
        </Badge>

        {/* Floating Action Button for Quick Add */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-5 left-0 right-0 flex justify-center px-5"
            >
              <div className="flex items-center gap-2 bg-background/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-border/30 w-full">
                <div className="flex items-center rounded-xl bg-muted/50 overflow-hidden h-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none hover:bg-muted/50 transition-colors"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none hover:bg-muted/50 transition-colors"
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <Button
                  className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20 h-10 text-sm hover:shadow-primary/40 active:scale-95 transition-all"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-1 bg-gradient-to-b from-transparent to-card/50">
        <h3 className="font-extrabold text-xl leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed font-medium">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-black tracking-tight text-primary">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md" aria-live="polite">
            {product.stock} in stock
          </span>
        </div>
      </div>
    </motion.div>
  );
}
