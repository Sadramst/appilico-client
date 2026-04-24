export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  iconName?: string;
  parentId?: string;
  parentName?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  children?: ICategory[];
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryTree extends ICategory {
  children: ICategoryTree[];
  level: number;
}

export interface ICreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  iconName?: string;
  isActive: boolean;
  sortOrder: number;
}

export type IUpdateCategoryRequest = ICreateCategoryRequest;
