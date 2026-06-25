import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminStats, generateAdminCoupon, getCoupons, createCoupon, disableCoupon, deleteCoupon } from '@/services/admin.service';
import { AdminStats, DiscountCode } from '@/types/admin';
import { toast } from 'sonner';

export const useAdminStatsQuery = () => {
  return useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });
};

export const useGenerateCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateAdminCoupon,
    onSuccess: (data: DiscountCode) => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      toast.success('Auto-generated coupon successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to generate coupon. Please check Nth-order rules.';
      toast.error(message);
    },
  });
};

export const useCouponsQuery = () => {
  return useQuery<DiscountCode[]>({
    queryKey: ['adminCoupons'],
    queryFn: getCoupons,
  });
};

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      toast.success('Coupon created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create coupon.');
    },
  });
};

export const useDisableCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disableCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      toast.success('Coupon disabled successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to disable coupon.');
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      toast.success('Coupon deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete coupon.');
    },
  });
};
