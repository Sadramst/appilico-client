export interface IProductReview {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
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

export interface IRatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}
