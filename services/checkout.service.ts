import api from './api';
import { Order } from '@/types/order';

export const processCheckout = async (data: { customerId: string; discountCode?: string }): Promise<Order> => {
  const response = await api.post('/checkout', data);
  return response.data.data;
};

export const validateDiscount = async (data: { code: string; cartSubtotal: number }): Promise<{ valid: boolean; discountAmount: number }> => {
  const response = await api.post('/checkout/validate-discount', { code: data.code });
  
  if (response.data.status === 'error') {
    return Promise.reject(new Error(response.data.message || 'Invalid discount code'));
  }
  
  const coupon = response.data.data;
  return { valid: true, discountAmount: data.cartSubtotal * (coupon.percentage / 100) };
};
