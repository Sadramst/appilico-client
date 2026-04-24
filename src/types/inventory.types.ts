export interface IInventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  type: InventoryTransactionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

export type InventoryTransactionType =
  | "StockIn"
  | "StockOut"
  | "Adjustment"
  | "Return"
  | "Damaged";

export interface IStockItem {
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  currentStock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  variants: IVariantStock[];
}

export interface IVariantStock {
  variantId: string;
  variantName: string;
  sku: string;
  currentStock: number;
}

export interface IAdjustStockRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  type: InventoryTransactionType;
  reason?: string;
}
