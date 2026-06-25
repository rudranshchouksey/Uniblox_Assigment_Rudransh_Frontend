export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  customerId: string;
  items: CartItem[];
}
