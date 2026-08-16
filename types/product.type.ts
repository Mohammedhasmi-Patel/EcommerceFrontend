import { PaginationResponse } from "@/types/pagination.type";

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  originalPrice: number;
  sellPrice: number;
  thumbnailUrl?: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: PaginationResponse<ProductType>;
}
