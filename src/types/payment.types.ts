export interface IPayment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: number;
  transactionId: string | null;
  status: number;
  paidAt: string | null;
}

export interface ICreatePaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: number;
  transactionId: string;
}

export interface IRefund {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  reason: string | null;
  status: number;
  refundedAt: string | null;
}

export interface ICreateRefundRequest {
  amount: number;
  reason: string;
}
