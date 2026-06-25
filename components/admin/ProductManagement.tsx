'use client';

import { useState } from 'react';
import { useProductsQuery } from '@/features/products/useProducts';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ProductFormDialog } from './ProductFormDialog';
import { DeleteProductDialog } from './DeleteProductDialog';

export function ProductManagement() {
  const { data: products = [], isLoading } = useProductsQuery();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  return (
    <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col mt-6">
      <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/10">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Product Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your catalog, stock, and pricing.</p>
        </div>
        <Button onClick={handleCreate} className="rounded-xl shadow-md font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="overflow-auto max-h-[600px] custom-scrollbar">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16"></TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Product</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Category</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Price</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Stock</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                  No products found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/50 border border-border/50">
                      <img 
                        src={product.image || `https://picsum.photos/seed/${product.id}/100/100`} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{product.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50">{product.category || 'Uncategorized'}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {product.stock > 0 ? product.stock : <span className="text-destructive">Out of stock</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stock > 0 ? (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="opacity-70 border-0">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        product={selectedProduct} 
      />
      
      <DeleteProductDialog 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        product={selectedProduct} 
      />
    </div>
  );
}
