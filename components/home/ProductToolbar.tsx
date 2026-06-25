'use client';

import { Search, LayoutGrid, List as ListIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ViewMode = 'grid' | 'list';

export interface ProductToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
  categories: string[];
}

export function ProductToolbar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  categories,
}: ProductToolbarProps) {
  return (
    <div className="sticky top-24 z-30 bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <Select value={selectedCategory} onValueChange={(val) => { if (val) setSelectedCategory(val); }}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-muted/50 border-transparent">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={(val) => { if (val) setSortBy(val); }}>
          <SelectTrigger className="w-[160px] h-11 rounded-xl bg-muted/50 border-transparent">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center p-1 bg-muted/50 rounded-xl">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className={`w-9 h-9 rounded-lg ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className={`w-9 h-9 rounded-lg ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
          >
            <ListIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
