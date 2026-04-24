export interface ISpecialOffer {
  id: string;
  title: string;
  description: string;
  bannerImageUrl?: string;
  discountType: OfferDiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  products: ISpecialOfferProduct[];
  createdAt: string;
  updatedAt: string;
}

export type OfferDiscountType = "Percentage" | "FixedAmount";

export interface ISpecialOfferProduct {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  offerPrice: number;
}

export interface ICreateOfferRequest {
  title: string;
  description: string;
  discountType: OfferDiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: string[];
}

export type IUpdateOfferRequest = ICreateOfferRequest;
