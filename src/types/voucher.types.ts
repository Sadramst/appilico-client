export interface IVoucher {
  id: string;
  code: string;
  description: string;
  voucherType: number;
  value: number;
  valueType: number;
  minOrderAmount: number | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  isSingleUse: boolean;
}

export const VoucherTypeLabels: Record<number, string> = {
  0: "Gift",
  1: "Promo",
  2: "Reward",
};

export const VoucherValueTypeLabels: Record<number, string> = {
  0: "Percentage",
  1: "Fixed",
};

export interface ICreateVoucherRequest {
  code: string;
  description: string;
  voucherType: number;
  value: number;
  valueType: number;
  minOrderAmount?: number | null;
  maxRedemptions?: number | null;
  startDate: string;
  expiryDate: string;
  isSingleUse?: boolean;
}

export interface IUpdateVoucherRequest {
  description?: string;
  value: number;
  minOrderAmount?: number | null;
  maxRedemptions?: number | null;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface IValidateVoucherRequest {
  code: string;
  orderAmount: number;
}

export interface IValidateVoucherResponse {
  isValid: boolean;
  discountAmount: number;
  message: string;
}

export interface IRedeemVoucherRequest {
  code: string;
  orderId: string;
}
