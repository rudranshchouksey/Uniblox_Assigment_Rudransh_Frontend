import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processCheckout } from '@/services/checkout.service';
import { toast } from 'sonner';
import { CUSTOMER_ID } from '../cart/useCart';
import { Order } from '@/types/order';

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { customerId: string; discountCode?: string }) =>
      processCheckout(data),
    onSuccess: (data: Order) => {
      // Invalidate the cart so the navbar badge drops to 0
      queryClient.invalidateQueries({ queryKey: ['cart', CUSTOMER_ID] });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Checkout failed. Please try again.';
      toast.error(message);
    },
  });
};
