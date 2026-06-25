'use client';

import { useProductsQuery } from '@/features/products/useProducts';
import { ProductCard } from '@/components/shared/ProductCard';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX } from 'lucide-react';

import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Home() {
  const { data: products, isLoading, isError } = useProductsQuery();

  if (isLoading) {
    return (
      <LoadingState
        title="Products"
        description="Browse our latest collection of premium items."
        type="grid"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Products"
        message="Failed to load products. Please try again later."
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No Products"
        description="There are currently no products available at the moment."
        icon={<PackageX className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
      <div className="pb-4 border-b border-border/50">
        <h1 className="text-4xl font-extrabold tracking-tight">Products</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse our latest collection of premium items.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
