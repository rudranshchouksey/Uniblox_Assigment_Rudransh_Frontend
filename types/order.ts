export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  discountApplied?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date | string;
}
