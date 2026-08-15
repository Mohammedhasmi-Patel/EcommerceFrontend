export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  originalPrice: number;
  sellPrice: number;
  thumbnailUrl?: string;
}
