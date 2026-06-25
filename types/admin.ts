export type DiscountStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'DISABLED';

export interface DiscountCode {
  code: string;
  percentage: number;
  status: DiscountStatus;
  generatedAt: string;
  expiryDate?: string;
  usageCount: number;
  usageLimit?: number;
}

export interface AdminStats {
  totalOrders: number;
  itemsPurchased: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  discountCodes: DiscountCode[];
  orders: any[]; // we can use any[] or import Order type
}
