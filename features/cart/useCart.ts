import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/services/cart.service';
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

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem({ customerId: CUSTOMER_ID, productId, quantity }),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart', CUSTOMER_ID] });
      const previousCart = queryClient.getQueryData<Cart>(['cart', CUSTOMER_ID]);

      if (previousCart) {
        queryClient.setQueryData<Cart>(['cart', CUSTOMER_ID], {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', CUSTOMER_ID], context.previousCart);
      }
      toast.error('Failed to update quantity');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', CUSTOMER_ID] });
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      removeCartItem({ customerId: CUSTOMER_ID, productId }),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ['cart', CUSTOMER_ID] });
      const previousCart = queryClient.getQueryData<Cart>(['cart', CUSTOMER_ID]);

      if (previousCart) {
        queryClient.setQueryData<Cart>(['cart', CUSTOMER_ID], {
          ...previousCart,
          items: previousCart.items.filter((item) => item.productId !== productId),
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', CUSTOMER_ID], context.previousCart);
      }
      toast.error('Failed to remove item');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', CUSTOMER_ID] });
    },
  });
};

import { validateDiscount } from '@/services/checkout.service';

export const useValidateDiscountMutation = () => {
  return useMutation({
    mutationFn: validateDiscount,
  });
};
