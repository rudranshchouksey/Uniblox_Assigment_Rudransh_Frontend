import api from './api';
import { Order } from '@/types/order';

export const processCheckout = async (data: { customerId: string; discountCode?: string }): Promise<Order> => {
  const response = await api.post('/checkout', data);
  return response.data.data;
};
