export interface IProductReview {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface ICreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface IUpdateReviewRequest {
  rating: number;
  title: string;
  comment: string;
}
