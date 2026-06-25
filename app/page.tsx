'use client';

import { useState, useMemo, useEffect } from 'react';
import { useProductsQuery } from '@/features/products/useProducts';
import { ProductCard } from '@/components/shared/ProductCard';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductToolbar, ViewMode } from '@/components/home/ProductToolbar';
import { Button } from '@/components/ui/button';

import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Home() {
  const { data: products, isLoading, isError } = useProductsQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, viewMode]);

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full pb-12">
      <HeroSection featuredProducts={products.slice(0, 3)} />

      <ProductToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
      />

      {filteredAndSortedProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description="We couldn't find any products matching your current filters."
          icon={<PackageX className="h-12 w-12 text-muted-foreground" />}
          action={
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <motion.div 
            key={`${viewMode}-${currentPage}`}
            variants={container}
            initial="hidden"
            animate="show"
            className={
              viewMode === 'grid' 
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-6 max-w-4xl mx-auto w-full"
            }
          >
            {paginatedProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-border/50">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
