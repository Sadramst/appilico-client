export interface IPayment {
  id: string;
  orderId: string;
  orderNumber: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod =
  | "CreditCard"
  | "DebitCard"
  | "BankTransfer"
  | "CashOnDelivery"
  | "PayPal";

export type PaymentStatus =
  | "Pending"
  | "Completed"
  | "Failed"
  | "Refunded"
  | "PartialRefund";

export interface IRefund {
  id: string;
  paymentId: string;
  orderId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
}

export type RefundStatus = "Pending" | "Approved" | "Rejected" | "Completed";
