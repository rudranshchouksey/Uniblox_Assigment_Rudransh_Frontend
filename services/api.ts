import axios from 'axios';
import { Product } from '@/types/product';
import { Cart } from '@/types/cart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data.data;
};

export const getCart = async (customerId: string): Promise<Cart> => {
  const response = await api.get(`/cart/${customerId}`);
  return response.data.data;
};

export const addToCart = async (data: { customerId: string; productId: string; quantity: number }): Promise<Cart> => {
  const response = await api.post('/cart/items', data);
  return response.data.data;
};

export default api;
