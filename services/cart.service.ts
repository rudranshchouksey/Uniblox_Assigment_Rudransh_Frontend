import api from './api';
import { Cart } from '@/types/cart';

export const getCart = async (customerId: string): Promise<Cart> => {
  const response = await api.get(`/cart/${customerId}`);
  return response.data.data;
};

export const addToCart = async (data: { customerId: string; productId: string; quantity: number }): Promise<Cart> => {
  const response = await api.post('/cart/items', data);
  return response.data.data;
};

export const updateCartItem = async (data: { customerId: string; productId: string; quantity: number }): Promise<Cart> => {
  const response = await api.patch(`/cart/items/${data.productId}`, {
    customerId: data.customerId,
    quantity: data.quantity,
  });
  return response.data.data;
};

export const removeCartItem = async (data: { customerId: string; productId: string }): Promise<Cart> => {
  const response = await api.delete(`/cart/items/${data.productId}`, {
    data: { customerId: data.customerId },
  });
  return response.data.data;
};
