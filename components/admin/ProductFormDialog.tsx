'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product } from '@/types/product';
import { useCreateProductMutation, useUpdateProductMutation } from '@/features/products/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number({ message: 'Price must be a valid number' }).positive('Price must be greater than zero'),
  stock: z.number({ message: 'Stock must be a valid number' }).int().nonnegative('Stock cannot be negative'),
  category: z.string().optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const isEditing = !!product;
  
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      category: product?.category || '',
      image: product?.image || '',
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (isEditing) {
      updateMutation.mutate({ id: product.id, data }, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        }
      });
    } else {
      createMutation.mutate(data as Omit<Product, 'id'>, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) reset();
    }}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Create Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} className="bg-muted/50" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} className="bg-muted/50" />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="bg-muted/50" />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register('stock', { valueAsNumber: true })} className="bg-muted/50" />
              {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} className="bg-muted/50" placeholder="e.g. Keyboards" />
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...register('image')} className="bg-muted/50" placeholder="https://..." />
            {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
