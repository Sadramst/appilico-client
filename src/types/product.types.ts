export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  categoryId: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  images: IProductImage[];
  variants: IProductVariant[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  averageRating: number;
  reviewCount: number;
  salesCount: number;
  weight?: number;
  dimensions?: string;
  specifications: IProductSpecification[];
  createdAt: string;
  updatedAt: string;
}

export interface IProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface IProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: IVariantAttribute[];
  isActive: boolean;
}

export interface IVariantAttribute {
  name: string;
  value: string;
}

export interface IProductSpecification {
  key: string;
  value: string;
}

export interface IProductFilter {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  search?: string;
  sortBy?: ProductSortBy;
  page?: number;
  pageSize?: number;
}

export type ProductSortBy =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popular"
  | "rating"
  | "name-asc"
  | "name-desc";

export interface ICreateProductRequest {
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  categoryId: string;
  brandId?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: string;
  specifications: IProductSpecification[];
  variants: Omit<IProductVariant, "id">[];
}

export type IUpdateProductRequest = ICreateProductRequest;
