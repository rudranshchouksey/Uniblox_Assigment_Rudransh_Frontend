import api from './api';
import { Product } from '@/types/product';

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data.data;
};

export const createProduct = async (data: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post('/products', data);
  return response.data.data;
};

export const updateProduct = async (id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
