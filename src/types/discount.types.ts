export interface IDiscount {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: number;
  value: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
}

export const DiscountTypeLabels: Record<number, string> = {
  0: "Percentage",
  1: "Fixed",
  2: "BuyXGetY",
};

export interface ICreateDiscountRequest {
  code: string;
  name: string;
  description?: string | null;
  discountType: number;
  value: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  startDate: string;
  endDate: string;
  usageLimit?: number | null;
}

export interface IUpdateDiscountRequest {
  name: string;
  description?: string | null;
  value: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  startDate: string;
  endDate: string;
  usageLimit?: number | null;
  isActive: boolean;
}

export interface IValidateDiscountRequest {
  code: string;
  orderAmount: number;
}

export interface IValidateDiscountResponse {
  isValid: boolean;
  discountAmount: number;
  message: string;
}
