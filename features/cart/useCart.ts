import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart } from '@/services/api';
import { toast } from 'sonner';
import { Cart } from '@/types/cart';

// Hardcoded customer ID for the scope of this assignment
export const CUSTOMER_ID = 'cust_1';

export const useCartQuery = () => {
  return useQuery<Cart>({
    queryKey: ['cart', CUSTOMER_ID],
    queryFn: () => getCart(CUSTOMER_ID),
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addToCart({ customerId: CUSTOMER_ID, productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', CUSTOMER_ID] });
      toast.success('Added to cart');
    },
    onError: () => {
      toast.error('Failed to add to cart');
    },
  });
};
