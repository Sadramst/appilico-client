export interface ICategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  parentCategoryId: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  subCategories: ICategory[];
}

export interface ICategoryTree extends ICategory {
  subCategories: ICategoryTree[];
}

export interface ICreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string | null;
  parentCategoryId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export type IUpdateCategoryRequest = ICreateCategoryRequest;
