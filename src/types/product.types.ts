export interface IProduct {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string | null;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  basePrice: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  primaryImageUrl: string | null;
  createdAt: string;
  images: IProductImage[];
  variants: IProductVariant[];
}

export interface IProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface IProductVariant {
  id: string;
  variantName: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: string;
}

export interface IProductFilter {
  searchTerm?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface ICreateProductRequest {
  name: string;
  description: string;
  sku: string;
  barcode?: string | null;
  categoryId: string;
  brandId: string;
  basePrice: number;
  costPrice?: number;
  stockQuantity: number;
  minStockLevel?: number;
  weight?: number;
  dimensions?: string | null;
  isFeatured?: boolean;
}

export interface IUpdateProductRequest {
  name: string;
  description: string;
  barcode?: string | null;
  categoryId: string;
  brandId: string;
  basePrice: number;
  costPrice?: number;
  stockQuantity: number;
  minStockLevel?: number;
  weight?: number;
  dimensions?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ICreateVariantRequest {
  variantName: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: string;
}
