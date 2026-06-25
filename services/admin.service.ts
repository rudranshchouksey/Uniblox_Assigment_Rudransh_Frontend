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

export const getCoupons = async (): Promise<DiscountCode[]> => {
  const response = await api.get('/admin/coupons');
  return response.data.data;
};

export const createCoupon = async (data: { code: string; percentage: number; expiryDate?: string; usageLimit?: number }): Promise<DiscountCode> => {
  const response = await api.post('/admin/coupons', data);
  return response.data.data;
};

export const disableCoupon = async (code: string): Promise<DiscountCode> => {
  const response = await api.patch(`/admin/coupons/${code}/disable`);
  return response.data.data;
};

export const deleteCoupon = async (code: string): Promise<void> => {
  await api.delete(`/admin/coupons/${code}`);
};
