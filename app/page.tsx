'use client';

import { useProductsQuery } from '@/features/products/useProducts';
import { ProductCard } from '@/components/shared/ProductCard';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX } from 'lucide-react';

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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse our latest collection of premium items.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
