export interface IBrand {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
}

export interface ICreateBrandRequest {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
}

export interface IUpdateBrandRequest extends ICreateBrandRequest {
  isActive: boolean;
}
