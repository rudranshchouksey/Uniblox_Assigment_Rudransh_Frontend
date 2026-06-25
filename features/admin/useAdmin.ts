import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminStats, generateAdminCoupon } from '@/services/api';
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
      toast.success('Coupon generated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to generate coupon. Please check Nth-order rules.';
      toast.error(message);
    },
  });
};
