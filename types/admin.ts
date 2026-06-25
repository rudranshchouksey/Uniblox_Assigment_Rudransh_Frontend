export interface DiscountCode {
  code: string;
  percentage: number;
  used: boolean;
  generatedAt: string;
}

export interface AdminStats {
  totalOrders: number;
  itemsPurchased: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  discountCodes: DiscountCode[];
}
