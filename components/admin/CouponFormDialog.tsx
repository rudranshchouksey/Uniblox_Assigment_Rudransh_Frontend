'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateCouponMutation } from '@/features/admin/useAdmin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  percentage: z.number({ message: 'Discount percentage must be a number' }).min(1).max(100),
  expiryDate: z.string().optional(),
  usageLimit: z.number().min(1, 'Must be at least 1').optional().or(z.nan().transform(() => undefined)),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CouponFormDialog({ open, onOpenChange }: CouponFormDialogProps) {
  const createMutation = useCreateCouponMutation();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      percentage: 10,
      expiryDate: '',
      usageLimit: undefined as any,
    },
  });

  const onSubmit = (data: CouponFormValues) => {
    const payload = {
      code: data.code,
      percentage: data.percentage,
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined,
      usageLimit: data.usageLimit,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) reset();
    }}>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Coupon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input id="code" {...register('code')} className="bg-muted/50 font-mono uppercase" placeholder="SUMMER20" />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="percentage">Discount Percentage (%)</Label>
            <Input id="percentage" type="number" {...register('percentage', { valueAsNumber: true })} className="bg-muted/50" />
            {errors.percentage && <p className="text-sm text-destructive">{errors.percentage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input id="expiryDate" type="date" {...register('expiryDate')} className="bg-muted/50" />
            {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
            <Input id="usageLimit" type="number" {...register('usageLimit', { valueAsNumber: true })} className="bg-muted/50" placeholder="e.g. 100" />
            {errors.usageLimit && <p className="text-sm text-destructive">{errors.usageLimit.message}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
