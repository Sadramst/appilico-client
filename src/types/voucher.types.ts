export interface IVoucher {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  usageLimitPerUser?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = "Percentage" | "FixedAmount";

export interface IVoucherRedemption {
  id: string;
  voucherId: string;
  voucherCode: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  redeemedAt: string;
}

export interface ICreateVoucherRequest {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type IUpdateVoucherRequest = ICreateVoucherRequest;

export interface IValidateVoucherRequest {
  code: string;
  orderTotal: number;
}

export interface IValidateVoucherResponse {
  isValid: boolean;
  discountAmount: number;
  message: string;
}
