import api from './api';
import { AdminStats, DiscountCode } from '@/types/admin';

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get('/admin/stats');
  return response.data.data;
};

export const generateAdminCoupon = async (): Promise<DiscountCode> => {
  const response = await api.post('/admin/discounts/generate');
  return response.data.data;
};
