export interface IDiscount {
  id: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  applicableTo: DiscountApplicableTo;
  applicableIds: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = "Percentage" | "FixedAmount";

export type DiscountApplicableTo =
  | "AllProducts"
  | "SpecificProducts"
  | "SpecificCategories"
  | "SpecificBrands";

export interface ICreateDiscountRequest {
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  applicableTo: DiscountApplicableTo;
  applicableIds: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type IUpdateDiscountRequest = ICreateDiscountRequest;
