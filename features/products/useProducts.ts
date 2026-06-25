import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/api';
import { Product } from '@/types/product';

export const useProductsQuery = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};
