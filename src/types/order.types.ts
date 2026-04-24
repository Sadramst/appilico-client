export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: IOrderItem[];
  shippingAddress: IOrderAddress;
  billingAddress?: IOrderAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  voucherCode?: string;
  notes?: string;
  trackingNumber?: string;
  statusHistory: IOrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderStatusHistory {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  createdBy: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded"
  | "Returned";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded"
  | "PartialRefund";

export interface ICreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: string;
  voucherCode?: string;
  notes?: string;
}

export interface IUpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
  trackingNumber?: string;
}
