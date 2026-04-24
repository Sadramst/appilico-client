export interface ISpecialOffer {
  id: string;
  name: string;
  description: string;
  bannerImageUrl: string | null;
  offerType: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  products: ISpecialOfferProduct[];
}

export const OfferTypeLabels: Record<number, string> = {
  0: "Flash",
  1: "Seasonal",
  2: "Clearance",
  3: "Bundle",
};

export interface ISpecialOfferProduct {
  productId: string;
  productName: string;
  offerPrice: number;
  originalPrice: number;
  maxQuantityPerCustomer: number | null;
}

export interface ICreateOfferRequest {
  name: string;
  description: string;
  offerType: number;
  startDate: string;
  endDate: string;
}

export type IUpdateOfferRequest = ICreateOfferRequest;

export interface IAddOfferProductsRequest {
  products: {
    productId: string;
    offerPrice: number;
    maxQuantityPerCustomer?: number | null;
  }[];
}
