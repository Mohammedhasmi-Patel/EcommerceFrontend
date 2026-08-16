export interface PaginationResponse<T> {
  items: T[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
