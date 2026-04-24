export interface IInventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  transactionType: number;
  quantity: number;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export const InventoryTransactionTypeLabels: Record<number, string> = {
  0: "StockIn",
  1: "StockOut",
  2: "Adjustment",
  3: "Return",
};

export interface IStockItem {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  minStockLevel: number;
}

export interface IAdjustStockRequest {
  productId: string;
  variantId?: string | null;
  transactionType: number;
  quantity: number;
  reference?: string | null;
  notes?: string | null;
}
