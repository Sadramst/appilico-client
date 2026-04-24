export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPagination;
  errors: string[];
  timestamp: string;
}

export interface IPagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedResponse<T> {
  items: T[];
  pagination: IPagination;
}

export interface IApiError {
  status: number;
  message: string;
  errors: string[];
}

export interface IQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
