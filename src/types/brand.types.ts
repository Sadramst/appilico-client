export interface IBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBrandRequest {
  name: string;
  description?: string;
  websiteUrl?: string;
  isActive: boolean;
}

export type IUpdateBrandRequest = ICreateBrandRequest;
