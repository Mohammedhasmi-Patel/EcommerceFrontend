export interface ProductMediaDTO {
  id: string;
  url: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProductDetailType {
  id: string;
  name: string;
  slug: string;
  description: string;
  originalPrice: number;
  sellPrice: number;
  media: ProductMediaDTO[];
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ProductDetailType;
}
