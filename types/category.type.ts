import { PaginationResponse } from "@/types/pagination.type";

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: PaginationResponse<CategoryType>;
}
