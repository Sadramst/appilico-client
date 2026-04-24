export interface ICart {
  id: string;
  userId?: string;
  items: ICartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  voucherCode?: string;
  voucherDiscount?: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  variantId?: string;
  variantName?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
}

export interface IAddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface IUpdateCartItemRequest {
  quantity: number;
}
