export interface ICart {
  id: string;
  customerId: string;
  items: ICartItem[];
  total: number;
}

export interface ICartItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IAddToCartRequest {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface IUpdateCartItemRequest {
  quantity: number;
}
