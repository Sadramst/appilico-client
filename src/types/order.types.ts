export interface IOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderStatus: number;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentStatus: number;
  paymentMethod: number;
  orderDate: string;
  voucherCode: string | null;
  notes: string | null;
  items: IOrderItem[];
}

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  discount: number;
}

export interface IOrderStatusHistory {
  oldStatus: number;
  newStatus: number;
  notes: string | null;
  changedAt: string;
}

export const OrderStatusLabels: Record<number, string> = {
  0: "Pending",
  1: "Confirmed",
  2: "Processing",
  3: "Shipped",
  4: "Delivered",
  5: "Cancelled",
  6: "Returned",
  7: "Refunded",
};

export const PaymentStatusLabels: Record<number, string> = {
  0: "Pending",
  1: "Paid",
  2: "Failed",
  3: "Refunded",
  4: "PartiallyRefunded",
};

export const PaymentMethodLabels: Record<number, string> = {
  0: "CreditCard",
  1: "DebitCard",
  2: "PayPal",
  3: "BankTransfer",
  4: "CashOnDelivery",
};

export interface ICreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: number;
  voucherCode?: string | null;
  notes?: string | null;
}

export interface IUpdateOrderStatusRequest {
  newStatus: number;
  notes?: string | null;
}
