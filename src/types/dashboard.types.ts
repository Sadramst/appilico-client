export interface ISalesSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  revenueTrend: number;
  ordersTrend: number;
  customersTrend: number;
}

export interface IRevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ITopProduct {
  productId: string;
  productName: string;
  productImage: string;
  totalSold: number;
  totalRevenue: number;
}

export interface ICategoryRevenue {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface ICustomerGrowth {
  date: string;
  newCustomers: number;
  totalCustomers: number;
}

export interface IDashboardStats {
  salesSummary: ISalesSummary;
  revenueData: IRevenueData[];
  topProducts: ITopProduct[];
  categoryRevenue: ICategoryRevenue[];
  customerGrowth: ICustomerGrowth[];
  recentOrders: IRecentOrder[];
  lowStockProducts: ILowStockAlert[];
}

export interface IRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface ILowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
}

export type DashboardPeriod = "daily" | "weekly" | "monthly" | "yearly";
