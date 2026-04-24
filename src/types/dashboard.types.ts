export interface ISalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
}

export interface IRevenueData {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface ITopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export interface ICustomerStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeCustomers: number;
}

export interface IDashboardStats {
  salesSummary: ISalesSummary;
  revenueData: IRevenueData[];
  topProducts: ITopProduct[];
  customerStats: ICustomerStats;
}

export interface IDashboardDateParams {
  from?: string;
  to?: string;
  count?: number;
}
